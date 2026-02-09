# Build Issue Fix

## Problem
The build was failing with a segmentation fault (exit code 139) when using Node.js 22.18.0. This was due to incompatibility between Node.js 22 and native modules used by Plasmo (@parcel/watcher).

## Solution ✅ (FIXED)
**You can now use Node.js 22!** The fix is to set the `PARCEL_WORKER_BACKEND=process` environment variable, which forces Parcel to use a process-based worker backend instead of the native module that causes the segfault.

The build scripts in `package.json` have been updated to include this fix automatically.

### How It Works

The `PARCEL_WORKER_BACKEND=process` environment variable tells Parcel to use a process-based worker backend instead of the native `@parcel/watcher` module. This avoids the segmentation fault while maintaining full functionality.

### Manual Usage (if needed)

If you need to run commands manually without the npm scripts:

```bash
# Build
PARCEL_WORKER_BACKEND=process npx pnpm build

# Dev
PARCEL_WORKER_BACKEND=process npx pnpm dev

# Package
PARCEL_WORKER_BACKEND=process npx pnpm package
```

## What Was Fixed

1. ✅ **Tailwind CSS config** - Fixed the content pattern to exclude `node_modules`:
   - Changed from `["./**/*.tsx"]` to `["./src/**/*.tsx", "./src/**/*.ts"]`

2. ✅ **Plasmo version** - Updated from 0.89.1 to 0.90.5

3. ✅ **@parcel/watcher** - Updated to latest version (2.5.6)

4. ✅ **Build scripts** - Added `PARCEL_WORKER_BACKEND=process` to all build commands to fix Node.js 22 compatibility

## Usage

You can now use Node.js 22 without any issues! Just run:

```bash
npx pnpm build    # Builds successfully with Node.js 22
npx pnpm dev      # Dev mode works too
npx pnpm package  # Packaging works too
```

The environment variable is automatically set in the npm scripts, so you don't need to remember to set it manually.
