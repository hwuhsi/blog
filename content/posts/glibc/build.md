---
title: "build gnu libc"
date: 2021-04-09
---

## 如何使程序加载指定版本的glibc库？

1.首先去仓库下载指定的libc和ld版本 e.g.https://mirror.tuna.tsinghua.edu.cn/ubuntu/pool/main/g/glibc/

下载好后，使用命令

```bash
ar vx libc
```

解压data.tar.gz，并得到里面的ld-2.23.so位置（具体文件根据版本）

2.下载patchelf: https://github.com/NixOS/patchelf

安装按照所给的指引即可。

然后运行

```bash
patchelf --set-interpreter ld-2.23-so program
```

第一个参数填入ld-2.23.so的位置

注意此处不要使用ld-linux-x86-64.so.2，因为这是连接到绝对路径/lib/x86_64-linux-gnu/ld-2.23.so的，因而无法找到该文件

3.运行时添加环境变量`LD_PRELOAD	`

例如，在pwntools下

```python
p = process(['./main'],env={'LD_PRELOAD':'./libc-2.23.so'})
```

若需要调试，在gdbinit文件下写入

```bash
set exec-wrapper env 'LD_PRELOAD=/home/hwuhsi/Desktop/libcs/install/lib/libc-2.23.so'
```



## 编译glibc

首先下载指定版本的glibc源码

然后在与源码同级的目录下创建一个`glibc-build`文件夹，以及一个`install`文件夹

然后运行命令

```bash
cd glibc-build
../glibc-2.23/configure --disable-werror --prefix=/home/hwuhsi/Desktop/libcs/install
```

## 链接编译的glibc

为了帮助辨识加载的glibc版本，写一个c程序

```c
#include <stdio.h>
#include <gnu/libc-version.h>


int main() {
    puts(gnu_get_libc_version());
}
```

makefile

```makefile
LIBPATH := /home/hwuhsi/Desktop/libcs/install/lib
LDPATH := $(LIBPATH)/ld-2.23.so

a: a.c
	gcc -Xlinker -rpath=$(LIBPATH) -Xlinker -I$(LDPATH) a.c -o a
```

![image-20210404003056857](https://i.loli.net/2021/04/04/qxKjzUCwrERHc8S.png)

可以看到成功加载了2.23版本的glibc

set exec-wrapper env 'LD_PRELOAD=/home/hwuhsi/Desktop/libcs/install/lib/libc-2.23.so'