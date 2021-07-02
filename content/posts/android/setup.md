---
title: "frida"
---

## Development Tools



## Android Device

You must have a rooted android device. In my case, xiaomi note 9 pro with magisk installed.



First, download frida-server from their github release(https://github.com/frida/frida/releases), or from magisk module store. 

If you are downloading from github release, please follow the guides from https://frida.re/docs/android/.

then, install frida utilities, including `frida-tools` and `frida-dexdump`, which is used to dump dex file from running process.

I recommand useing `pipx` to install these tools, because it don't pollute your global pip modules.

make sure you have connected your device by usb.

```bash
frida-ps -U
```

using the above command to show all the process running on your phone.





