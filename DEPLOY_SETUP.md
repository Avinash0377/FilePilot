# 🚀 FilePilot CI/CD Setup Guide

## Quick Setup (One-Time Only)

### Step 1: Add GitHub Secrets
Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 3 secrets:

| Secret Name | Value |
|-------------|-------|
| `DROPLET_IP` | `134.209.147.41` |
| `DROPLET_USER` | `root` |
| `SSH_PRIVATE_KEY` | Your SSH private key (see below) |

### Step 2: Get Your SSH Private Key

Run this on your PC (PowerShell):
```powershell
# If you already have a key, show it:
cat ~/.ssh/id_rsa

# If you don't have one, create it:
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

Copy the **entire content** including:
```
-----BEGIN RSA PRIVATE KEY-----
...content...
-----END RSA PRIVATE KEY-----
```

Paste this as the `SSH_PRIVATE_KEY` secret in GitHub.

### Step 3: Add Public Key to Droplet

Make sure your public key is on the droplet:
```bash
# On your Droplet (via SSH):
cat ~/.ssh/authorized_keys
# Your public key should be there

# If not, add it from your PC:
ssh-copy-id root@134.209.147.41
```

---

## How to Deploy Now

Just push to your `main` or `master` branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Go to **GitHub → Actions** tab to watch the deployment!

---

## What Happens on Each Push

1. ⬇️ GitHub pulls your code
2. 🏗️ Builds Docker image (cached - fast for small changes!)
3. 📦 Pushes to ghcr.io
4. 🚀 SSH to Droplet → Pulls new image → Restarts container
5. ✅ Done in ~3 minutes!

---

## Troubleshooting

**Build failing?**
- Check Actions tab for error logs

**SSH failing?**
- Verify secrets are set correctly
- Test: `ssh root@134.209.147.41` from your PC

**Container not starting?**
- SSH to droplet: `docker logs filepilot`
