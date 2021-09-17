const navigation = document.querySelector(".navigation")
const hamburgers = document.getElementsByClassName('hamburger')
hamburgers[0].addEventListener('click', () => {
    console.log("i love hamburgers")

    navigation.classList.toggle('display')

})