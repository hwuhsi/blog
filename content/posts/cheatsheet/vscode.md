msys64 vscode configuration file

```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${default}"
            ],
            "defines": [],
            "compilerPath": "C:/msys64/mingw64/bin/g++.exe",
            "cStandard": "c17",
            "cppStandard": "c++17",
            "intelliSenseMode": "windows-gcc-x64"
        }
    ],
    "version": 4
}
```

and `settings.json`

```json
{
    "terminal.integrated.shell.windows": "C:\\msys64\\usr\\bin\\bash.exe",
    "terminal.integrated.shellArgs.windows": ["--login", "-i"],
    "terminal.integrated.env.windows": {
        "MSYSTEM": "MINGW64",
        "CHERE_INVOKING": "1",
        "MSYS2_PATH_TYPE": "inherit"
    }
}
```

