# 🚀 Release Guide

This document explains how to create releases for the Quantcast GraphQL CLI.

## 📋 Release Process

### Option 1: Automatic Release (Recommended)
1. Create and push a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The GitHub Actions workflow will automatically:
   - Build CLI executables for all platforms
   - Run tests
   - Generate checksums
   - Create a GitHub release with download links
   - Upload all artifacts

### Option 2: Manual Release
1. Go to GitHub Actions tab
2. Select "Build and Release CLI Executables" workflow  
3. Click "Run workflow"
4. Enter the version (e.g., `v1.0.1`)
5. Click "Run workflow"

## 📦 What Gets Built

The release workflow creates executables for:

| Platform | Architecture | Filename |
|----------|-------------|----------|
| Linux | x64 | `quantcast-cli-linux-x64` |
| Windows | x64 | `quantcast-cli-windows-x64.exe` |  
| macOS | ARM64 | `quantcast-cli-macos-arm64` |
| macOS | x64 | `quantcast-cli-macos-x64` |

## 📄 Release Notes

Each release includes:
- **Download links** for all platforms
- **Quick start guide** 
- **Feature highlights**
- **Command examples**
- **File sizes and checksums**
- **Security verification info**

## 🏷️ Version Naming

Use semantic versioning:
- **v1.0.0** - Major release
- **v1.1.0** - Minor release (new features)
- **v1.0.1** - Patch release (bug fixes)
- **v1.0.0-beta.1** - Pre-release

## ⚡ Quick Commands

```bash
# Create a new release
git tag v1.0.0 && git push origin v1.0.0

# List existing releases
git tag -l

# Delete a tag (before pushing)
git tag -d v1.0.0

# Delete a remote tag (if needed)
git push origin --delete v1.0.0
```

## 🔧 Testing Before Release

Always test the build locally first:

```bash
# Run tests
bun test

# Build all executables
bun run build:cli:all

# Test a specific executable
./release/quantcast-cli-linux-x64 --help
```

## 📊 Release Artifacts

Each release includes:
- ✅ Cross-platform executables
- ✅ SHA256 checksums
- ✅ Detailed release notes
- ✅ File size information
- ✅ Quick start instructions

The workflow ensures all executables are properly built, tested, and verified before release.