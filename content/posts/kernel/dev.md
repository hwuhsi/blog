---
title: "kernel development environment"
date: 2021-03-08
update: 2021-04-27
categories: "kernel"
tags: "kernel"
draft: false
---



i choose vscode

```json
{
    "configurations": [
        {
            "name": "Linux",
            "compilerPath": "/usr/bin/clang",
            "cStandard": "gnu89",
            "cppStandard": "gnu++98",
            "intelliSenseMode": "linux-clang-x64",
            "compilerArgs": ["-nostdinc", "-isystem",  "/usr/lib/clang/11.1.0/include"],
            "includePath": [
                "${workspaceFolder}/arch/x86/include",
                "${workspaceFolder}/arch/x86/include/generated",
                "${workspaceFolder}/include",
                "${workspaceFolder}/arch/x86/include/uapi",
                "${workspaceFolder}/arch/x86/include/generated/uapi",
                "${workspaceFolder}/include/uapi",
                "${workspaceFolder}/include/generated/uapi"
            ],
            "forcedInclude": ["${workspaceFolder}/include/linux/kconfig.h", "${workspaceFolder}/include/linux/compiler_types.h"],
            "defines": ["__KERNEL__", "KBUILD_MODNAME=\"hwuhsi\""]
        }
    ],
    "version": 4
}
```

if ubuntu

```bash
sudo apt-get install build-essential libncurses-dev bison flex libssl-dev libelf-dev
```

and if you choose to generate debug info 

```bash
sudo apt install dwarves
```

and then

```bash
make menuconfig
```

compile

```bash
make bzImage -j6
```



## Add Syscall

due to some security factors, https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0029

we can use macro `SYSCALL_DEFINEX` to define our macro(where x is not the actual content, it's the number of arguments)

to add our own syscall, add a sub folder inside kernel source dir, create 2 file: `mysyscall.c`, `Makefile`

mysyscall.c

```c
#include <linux/syscalls.h>
#include <linux/types.h>
#include <linux/kernel.h>


asmlinkage long mysyscall(long a, long b, long c) {

	printk("hello world");
	return a + b + c;
}

SYSCALL_DEFINE3(mysyscall, long, a, long, b, long, c) {
	return mysyscall(a, b, c);
}
```

and Makefile

```makefile
obj-y := mysyscall.o
```



arch/x86/entry/syscalls/syscall_64.tbl

```
544	x32	io_submit		compat_sys_io_submit
545	x32	execveat		compat_sys_execveat
546	x32	preadv2			compat_sys_preadv64v2
547	x32	pwritev2		compat_sys_pwritev64v2
# This is the end of the legacy x32 range.  Numbers 548 and above are
# not special and are not to be used for x32-specific syscalls.

2000	64	mysyscall			sys_mysyscall
```



include/linux/syscalls.h

```c
long compat_ksys_semtimedop(int semid, struct sembuf __user *tsems,
			    unsigned int nsops,
			    const struct old_timespec32 __user *timeout);

int __sys_getsockopt(int fd, int level, int optname, char __user *optval,
		int __user *optlen);
int __sys_setsockopt(int fd, int level, int optname, char __user *optval,
		int optlen);

asmlinkage long sys_mysyscall(int a, int b, int c);

#endif
```

```makefile
export MODORDER := $(extmod-prefix)modules.order
export MODULES_NSDEPS := $(extmod-prefix)modules.nsdeps

ifeq ($(KBUILD_EXTMOD),)
core-y		+= kernel/ certs/ mm/ fs/ ipc/ security/ crypto/ block/ mysyscall/

vmlinux-dirs	:= $(patsubst %/,%,$(filter %/, \
		     $(core-y) $(core-m) $(drivers-y) $(drivers-m) \
		     $(libs-y) $(libs-m)))
```

## BusyBox



```bash
make install
```



```bash
cd _install
mkdir proc
mkdir sys
touch init
chmod +x init
```



```bash
#!/bin/sh
echo "{==DBG==} INIT SCRIPT"
mkdir /tmp
mount -t proc none /proc
mount -t sysfs none /sys
mount -t debugfs none /sys/kernel/debug
mount -t tmpfs none /tmp
mdev -s 
# We need this to find /dev/sda later
echo -e "{==DBG==} Boot took $(cut -d' ' -f1 /proc/uptime) seconds"
#setsid /bin/cttyhack setuidgid 1000 /bin/sh #normal user
exec /bin/sh #root
```



```bash
find . | cpio -o --format=newc > ./rootfs.img
```

## Qemu



```bash
sudo apt install qemu-system-x86
```





