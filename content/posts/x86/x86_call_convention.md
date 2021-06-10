---
title: "x86 calling convention"
date: 2020-12-22
update: 2021-04-02
tag: asm
categories: re
draft: false
---

ABI即`application binary interface`，涵盖了一些二进制可执行文件格式，以及调用规定的信息。

## 64bit 

amd64架构的abi有msvc abi和system v abi(https://uclibc.org/docs/psABI-x86_64.pdf)

windows和linux平台遵循不同的abi,因此linux的应用程序不能够直接在windows下执行。

这里主要探讨的是64位的调用约定。

### MSVC ABI

即64位的visual c++程序遵循的abi

详见https://docs.microsoft.com/en-us/cpp/build/x64-calling-convention?view=msvc-160


| 参数       | 类型  | 浮点类型 |
| ---------- | :---: | -------: |
| 第一个参数 |  RCX  |     XMM0 |
| 第二个参数 |  RDX  |     XMM1 |
| 第三个参数 |  R8   |     XMM2 |
| 第四个参数 |  R9   |     XMM3 |

这些寄存器加上RAX, R10, R11, XMM4, 和XMM5为易失寄存器。



调用函数时，调用者先预留32字节的栈空间，用以让被调用函数保存非易失寄存器的值（`rbx, rbp, rsi`）

但若还更改了其他的非易失寄存器，则额外的在prolog加入`push`指令，然后在epilog处`pop`掉。

函数以`ret`结束后，调用者还需要平衡堆栈。

因此，第一个栈上的参数在28h的位置

例如：

```assembly
; DWORD64 add(DWORD64 a, DWORD64 b, DWORD64 c, DWORD64 d, DWORD64 e, DWORD64 f)
add PROC
	lea rax, [rcx + rdx]
	add rax, r8
	add rax, r9
	add rax, [rsp + 28h]
	add rax, [rsp + 30h]
add ENDP
```

调用add

```assembly
main PROC
	sub rsp, 30h
	mov rcx, 1
	mov rdx, 1
	mov r8, 1
	mov r9, 1
	mov rax, 1
	mov [rsp + 20h], rax
	mov [rsp + 28h], rax
	call add
	add rsp, 30h
	ret
main ENDP
```



注意当调用的参数混合了整型和浮点型，例如

```c
int fun(float a, int b, long c, double d);
```

整型与浮点一起计数，即b为rdx传参，c为r8, d为xmm3，不受其他参数影响。



## System V ABI

为linux使用的abi

当参数在六个以下时，使用rdi，rsi，rdx，rcx，r8，r9寄存器传参。

浮点数使用xmm0~xmm5传参。

与msvc abi不同的是，当遇到混合传参的情况，例如

```c
int fun(float a, int b, long c, double d, unsigned int e, float f);
```

整型参数与浮点参数分开计数。

当参数超过六个，超过的部分从右向左入栈。

## 32bit

32位的调用规约

### cdecl

msvc编译器对32位程序默认的调用规约。

所有参数都通过栈传递，调用者平衡栈

### stdcall

与cdecl调用规约一样是通过栈传递参数，不同的是通过被调用者平衡堆栈（使用`retn`指令）

### fastcall

头两个参数使用寄存器`ecx, edx`传递，剩余使用栈传递

