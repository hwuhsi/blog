---
title: "inside gnu libc"
---

## elf

一般而言，典型的c程序编译出的可执行文件在main函数执行之前的那部分，即entry部分，先会初始化一部分的参数，然后调用`__libc_start_main`函数，通过它再调用main函数。然而，这个`__libc_start_main`在got表里，通过ida可以发现对应的plt条目全是0。很显然，不会真的去执行这段全为0的指令，在此之前仍然有其他的初始化步骤。

实际上[link][1]，程序真正的入口点并非就一定是elf中的entry条目，当elf中的`PT_INTERP`条目被设置时（这个条目实际上就是linker所在的位置），内核会先执行linker中的entry,然后通过某种途径将用户程序的入口点传给它。

作为验证，开启gdb，然后使用命令`starti`

![image-20210409231255450](https://i.loli.net/2021/04/09/Cw9gD8EzV4M217W.png)

这个可以说是整个程序最原始的样子。下面将一点点的进行分析。

初始时，对于寄存器而言，除了`rsp`之外的寄存器全被清零。

栈上的值可以看到是环境变量。但是除此之外，还有别的值得注意的东西。

![image-20210410001945564](https://i.loli.net/2021/04/10/RcvLp7ogrNMO3wK.png)





[1]: https://lwn.net/Articles/631631/

