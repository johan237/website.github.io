# Deploying Your Hugo Site to GitHub Pages

Follow these steps to deploy your Hugo site to GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `my-personal-website` or `johan-blog`)
3. **Don't** initialize it with a README, .gitignore, or license (we'll add these)

## Step 2: Update Your Config

Update `exampleSite/config.toml` with your GitHub Pages URL:

```toml
baseURL = "https://YOUR_USERNAME.github.io/REPO_NAME/"
```

For example, if your username is `johan237` and repo is `my-blog`:
```toml
baseURL = "https://johan237.github.io/my-blog/"
```

## Step 3: Initialize Git and Push to GitHub

From the **root of your Hugo project** (not the exampleSite folder), run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically run and deploy your site

## Step 5: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

The first deployment may take a few minutes. You can check the progress in the **Actions** tab of your repository.

## Important Notes

- The workflow builds from the `exampleSite` directory
- Make sure your default branch is `main` (or update the workflow file if it's `master`)
- After pushing, GitHub Actions will automatically build and deploy your site
- Future pushes to `main` will automatically trigger new deployments

## Troubleshooting

- If the site doesn't appear, check the **Actions** tab for any errors
- Make sure the `baseURL` in `config.toml` matches your repository name
- Verify that GitHub Pages is enabled in repository Settings → Pages

