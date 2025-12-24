---
title: "An introduction to fuzzy logic with python code."
date: 2025-12-24
tags: [fuzzy, python, machine-learning]
toc: true

---

## Introduction

Fuzzy logic is a branch of artificial intelligence that deals with "fuzzy" data—data that cannot be represented by discrete state values. Unlike traditional binary logic where something is either true (1) or false (0), fuzzy logic allows for degrees of truth, making it particularly useful for handling real-world concepts like temperature, distance, speed, and other continuous variables.

Consider temperature as an example. Traditional binary logic might classify temperature as either cold (0) or hot (1). A more refined approach would be to create multiple discrete states: [cold, cool, warm, hot], and use one-hot encoding where cold might be represented as [1, 0, 0, 0].

However, this approach still has a fundamental limitation: it cannot handle values that belong to multiple categories simultaneously. For instance, if I were to give you a cup of water with a relatively high temperature and ask "Is this water too hot?", you might answer "It's a bit hot but not too hot." By saying this, you're expressing that it's not 100% hot—perhaps 70% hot and 30% warm. This type of reasoning, where values can belong to multiple sets with varying degrees of membership, is at the core of fuzzy logic.

## What is Fuzzy Logic?

Fuzzy logic is a type of many-valued logic that deals with "degrees of truth," allowing variables to have truth values anywhere between 0 (completely false) and 1 (completely true). Unlike classical logic, fuzzy logic mimics human-like reasoning by handling uncertainty and imprecision naturally.

So the question becomes: how do we model this fuzzy system?

### The Four Pillars of Fuzzy Logic

In order to model a fuzzy logic system, we need four essential components:

#### 1. Membership Functions

A membership function tells us how much a discrete value belongs to a particular fuzzy set. It maps input values to membership degrees between 0 and 1. For our temperature example, we can define the following membership functions:

**Cold:**
$$\mu_{\text{Cold}}(x) = \begin{cases}
    1 & x \leq 10 \\
    \frac{20-x}{10} & 10 < x < 20 \\
    0 & x \geq 20
\end{cases}$$

**Cool:**
$$\mu_{\text{Cool}}(x) = \begin{cases}
    0 & x \leq 10 \text{ or } x \geq 30 \\
    \frac{x-10}{10} & 10 < x \leq 20 \\
    \frac{30-x}{10} & 20 < x < 30
\end{cases}$$

**Warm:**
$$\mu_{\text{Warm}}(x) = \begin{cases}
    0 & x \leq 20 \text{ or } x \geq 40 \\
    \frac{x-20}{10} & 20 < x \leq 30 \\
    \frac{40-x}{10} & 30 < x < 40
\end{cases}$$

**Hot:**
$$\mu_{\text{Hot}}(x) = \begin{cases}
    0 & x \leq 30 \\
    \frac{x-30}{10} & 30 < x < 40 \\
    1 & x \geq 40
\end{cases}$$

Let's calculate the membership values for a temperature of 35°C:
- $\mu_{\text{Cold}}(35) = 0$ (not cold)
- $\mu_{\text{Cool}}(35) = 0$ (not cool)
- $\mu_{\text{Warm}}(35) = \frac{40-35}{10} = 0.5$ (50% warm)
- $\mu_{\text{Hot}}(35) = \frac{35-30}{10} = 0.5$ (50% hot)

This demonstrates the power of fuzzy logic: at 35 degrees, the temperature simultaneously belongs to both the "warm" and "hot" sets with equal degrees of membership (0.5 each), rather than being forced into a single discrete category.

#### 2. Fuzzy Rules

Fuzzy rules are IF-THEN statements that define the relationship between input variables and output variables. These rules use linguistic variables and are expressed in natural language, making them intuitive and easy to understand. For example:

- IF temperature is Cold THEN heating is High
- IF temperature is Cool THEN heating is Medium
- IF temperature is Warm THEN heating is Low
- IF temperature is Hot THEN heating is Off

These rules capture expert knowledge or heuristics about how the system should behave. Multiple rules can be active simultaneously, each contributing to the final output based on their membership values. The strength of each rule's contribution depends on how well the input matches the rule's condition.

#### 3. Inference Engine

The inference engine applies the fuzzy rules to the input values. It combines the membership values from the membership functions with the fuzzy rules to determine the degree to which each rule is activated. Common inference methods include:

- **Mamdani inference**: Uses min-max operations. The output membership function is clipped at the rule's strength (minimum), and then all outputs are combined using maximum (union).
- **Sugeno inference**: Uses weighted averages. The output is a linear combination of input variables, weighted by the rule's firing strength.

The inference engine processes all applicable rules and produces a fuzzy output set, which represents the aggregated result of all active rules.

#### 4. Defuzzification

Defuzzification is the process of converting the fuzzy output set back into a crisp (numerical) value. Since fuzzy logic produces membership values (degrees of truth), we need to convert these back to actionable numerical outputs that can control a system or make a decision.

Common defuzzification methods include:

- **Centroid method**: Calculates the center of gravity of the output fuzzy set. This is the most commonly used method and provides a smooth output.
- **Max membership method**: Selects the output with the highest membership value. Simple but can be less smooth.
- **Weighted average method**: Computes a weighted average of the output values, where weights are the membership degrees.

This final step gives us a concrete value that can be used to control a system or make a decision.

## Python Implementation

Now let's implement a fuzzy logic system in Python using the `scikit-fuzzy` library. We'll create a temperature control system that adjusts heating based on the current temperature.

First, install the required library:

```bash
pip install scikit-fuzzy numpy matplotlib
```

Here's a complete Python implementation:

```python
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
import matplotlib.pyplot as plt

# Define the universe of discourse (temperature range: 0-50°C)
temperature = ctrl.Antecedent(np.arange(0, 51, 1), 'temperature')

# Define fuzzy sets for temperature
temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 20])
temperature['cool'] = fuzz.trimf(temperature.universe, [10, 20, 30])
temperature['warm'] = fuzz.trimf(temperature.universe, [20, 30, 40])
temperature['hot'] = fuzz.trimf(temperature.universe, [30, 50, 50])

# Define the output variable (heating level: 0-100%)
heating = ctrl.Consequent(np.arange(0, 101, 1), 'heating')

# Define fuzzy sets for heating
heating['off'] = fuzz.trimf(heating.universe, [0, 0, 25])
heating['low'] = fuzz.trimf(heating.universe, [0, 25, 50])
heating['medium'] = fuzz.trimf(heating.universe, [25, 50, 75])
heating['high'] = fuzz.trimf(heating.universe, [50, 100, 100])

# Define fuzzy rules
rule1 = ctrl.Rule(temperature['cold'], heating['high'])
rule2 = ctrl.Rule(temperature['cool'], heating['medium'])
rule3 = ctrl.Rule(temperature['warm'], heating['low'])
rule4 = ctrl.Rule(temperature['hot'], heating['off'])

# Create the control system
heating_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4])
heating_sim = ctrl.ControlSystemSimulation(heating_ctrl)

# Test with different temperatures
test_temperatures = [5, 15, 25, 35, 45]

print("Temperature Control System Results:")
print("-" * 50)
for temp in test_temperatures:
    heating_sim.input['temperature'] = temp
    heating_sim.compute()
    print(f"Temperature: {temp}°C -> Heating: {heating_sim.output['heating']:.2f}%")

# Visualize membership functions
temperature.view()
heating.view()
plt.show()
```

### Manual Implementation

If you prefer to implement the membership functions manually without external libraries, here's a basic implementation:

```python
def membership_cold(x):
    """Membership function for 'cold' temperature."""
    if x <= 10:
        return 1.0
    elif 10 < x < 20:
        return (20 - x) / 10
    else:
        return 0.0

def membership_cool(x):
    """Membership function for 'cool' temperature."""
    if x <= 10 or x >= 30:
        return 0.0
    elif 10 < x <= 20:
        return (x - 10) / 10
    elif 20 < x < 30:
        return (30 - x) / 10
    return 0.0

def membership_warm(x):
    """Membership function for 'warm' temperature."""
    if x <= 20 or x >= 40:
        return 0.0
    elif 20 < x <= 30:
        return (x - 20) / 10
    elif 30 < x < 40:
        return (40 - x) / 10
    return 0.0

def membership_hot(x):
    """Membership function for 'hot' temperature."""
    if x <= 30:
        return 0.0
    elif 30 < x < 40:
        return (x - 30) / 10
    else:
        return 1.0

def calculate_memberships(temperature):
    """Calculate all membership values for a given temperature."""
    return {
        'cold': membership_cold(temperature),
        'cool': membership_cool(temperature),
        'warm': membership_warm(temperature),
        'hot': membership_hot(temperature)
    }

# Example usage
temp = 35
memberships = calculate_memberships(temp)
print(f"Temperature: {temp}°C")
for category, value in memberships.items():
    print(f"  {category.capitalize()}: {value:.2f} ({value*100:.0f}%)")
```

## Applications of Fuzzy Logic

Fuzzy logic has found applications in numerous fields:

- **Control Systems**: Air conditioning, washing machines, camera autofocus, and automotive systems
- **Decision Making**: Expert systems, medical diagnosis, and financial analysis
- **Pattern Recognition**: Image processing and speech recognition
- **Artificial Intelligence**: Natural language processing and machine learning
- **Consumer Electronics**: Rice cookers, vacuum cleaners, and other smart appliances

## Advantages and Limitations

### Advantages:
- Handles imprecision and uncertainty naturally
- Uses human-readable rules (IF-THEN statements)
- Can model complex, non-linear systems
- Robust to noise and variations
- Requires less precise mathematical models

### Limitations:
- Requires expert knowledge to define rules
- Can be computationally expensive for large systems
- May not be suitable for systems requiring precise mathematical models
- Rule tuning can be time-consuming

## Conclusion

Fuzzy logic provides a powerful framework for dealing with uncertainty and imprecision in real-world systems. By allowing degrees of truth rather than strict binary values, it enables more natural and human-like reasoning. The combination of membership functions, fuzzy rules, inference engines, and defuzzification creates a complete system capable of handling complex, ambiguous situations.

Whether you're building a temperature control system, designing an expert system, or working on any application that requires handling of imprecise data, fuzzy logic offers an intuitive and effective approach. The Python examples provided above demonstrate how easy it is to implement fuzzy logic systems, making this powerful technique accessible to developers and engineers.
