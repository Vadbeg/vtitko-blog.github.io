# Task: Create DOSBox .jsdos Bundle with Game Launchers

## Goal

Create a simple `.jsdos` bundle using DOSBox (not bootable MS-DOS) that:
1. Starts directly to a DOS prompt
2. Has games that can be launched via simple commands (e.g., typing `doom`)

## Background

- `.jsdos` files are ZIP archives
- Using DOSBox mode (no qcow2 disk image) — just folders
- Much easier to modify than bootable MS-DOS images
- Game compatibility is identical for our purposes

## Bundle Structure

A simple DOSBox `.jsdos` bundle looks like this:

```
my-bundle/
├── .jsdos/
│   └── dosbox.conf
└── c/
    ├── AUTOEXEC.BAT
    ├── DOOM.BAT
    ├── DOOM/
    │   ├── DOOM.EXE
    │   └── (other game files)
    └── (other games...)
```

No qcow2, no disk images — just plain folders that become the C: drive.

## Step-by-Step Tasks

### Step 1: Create the folder structure

```bash
mkdir -p dos-bundle/.jsdos
mkdir -p dos-bundle/c
```

### Step 2: Create dosbox.conf

Create `dos-bundle/.jsdos/dosbox.conf`:

```ini
[sdl]
fullscreen=false
autolock=true

[dosbox]
machine=svga_s3

[cpu]
core=auto
cputype=auto
cycles=auto

[mixer]
rate=44100

[render]
scaler=normal2x

[autoexec]
mount c .
c:
```

The `[autoexec]` section:
- Mounts the `c/` folder as the C: drive
- Switches to C: drive
- Then AUTOEXEC.BAT on C: runs automatically

### Step 3: Create AUTOEXEC.BAT

Create `dos-bundle/c/AUTOEXEC.BAT`:

```batch
@echo off
cls
echo.
echo ========================================
echo        DOS Game Terminal
echo ========================================
echo.
echo Available games:
echo   DOOM    - DOOM (1993)
echo.
echo Type a game name to play!
echo.
```

### Step 4: Add DOOM

Copy DOOM files into `dos-bundle/c/DOOM/`:

```
dos-bundle/c/DOOM/
├── DOOM.EXE
├── DOOM.WAD
└── (other files from the archive.org download)
```

### Step 5: Create DOOM.BAT launcher

Create `dos-bundle/c/DOOM.BAT`:

```batch
@echo off
cd \DOOM
DOOM.EXE
cd \
```

### Step 6: Bundle as .jsdos

```bash
cd dos-bundle
zip -r ../games.jsdos .jsdos c
```

**Important:** The zip should contain `.jsdos/` and `c/` at the root level.

### Step 7: Test

1. Go to dos.zone/player or your Jekyll site
2. Load the new `.jsdos` file
3. Should boot to prompt, type `doom` to play

## Adding More Games Later

For each new game:

1. Create folder: `c/GAMENAME/`
2. Copy game files into it
3. Create launcher: `c/GAMENAME.BAT`
4. Update `AUTOEXEC.BAT` to list it
5. Re-zip

Example for Wolf3D:

**c/WOLF3D.BAT:**
```batch
@echo off
cd \WOLF3D
WOLF3D.EXE
cd \
```

## File Locations

User needs to provide:
- DOOM files downloaded from archive.org (should be extracted somewhere)
- Location where the final `.jsdos` should be saved

## Notes

- All filenames should be uppercase (DOS convention)
- The bundle structure is simple — it's literally just a zip file
- No special tools needed, just file copying and zipping
- Test in browser at dos.zone/player before deploying to Jekyll site

## Troubleshooting

**"C: drive not found"**
- Check that `mount c .` is in dosbox.conf [autoexec]
- Make sure the `c/` folder exists at bundle root

**Game doesn't start**
- Check the exact EXE name in the game folder
- Update the .BAT file to match

**No sound**
- Some games need sound configuration
- Try running game's SETUP.EXE first
