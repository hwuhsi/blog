---
title: "exception handling in windows operating system"
date: 2021-02-03
update: 2021-02-03
categories: windows
---



## Structured Exception Handling



### x64平台

seh的实现需要编译器与操作系统的共同协作。对编译器而言，需要提取函数的开始地址，结束地址，函数的“序幕”（prolog）操作（包括栈操作和寄存器操作）还有异常处理信息，生成两个表，其中一个位于`.pdata`段，定义如下

| Size  | Value                  |
| :---- | :--------------------- |
| ULONG | Function start address |
| ULONG | Function end address   |
| ULONG | Unwind info address    |

这个结构被叫做`RUNTIME_FUNCTION`, 这样每一条函数的消息都是按照rva的大小升序排列的，能够便于查找。另外，还有一个`unwind info address`

这个结构是用于记录函数对栈指针的影响，以及非易失寄存器在栈中是如何保存的。

| Size       | Value                                  |
| :--------- | :------------------------------------- |
| UBYTE: 3   | Version                                |
| UBYTE: 5   | Flags                                  |
| UBYTE      | Size of prolog                         |
| UBYTE      | Count of unwind codes                  |
| UBYTE: 4   | Frame Register                         |
| UBYTE: 4   | Frame Register offset (scaled)         |
| USHORT * n | Unwind codes array                     |
| variable   | Can either be of form (1) or (2) below |

最后一个variable是一个union类型，取以下二者中的一个

(1) Exception handler

| Size     | Value                                     |
| :------- | :---------------------------------------- |
| ULONG    | Address of exception handler              |
| variable | Language-specific handler data (optional) |

(2) Chained Unwind Info

| Size  | Value                  |
| :---- | :--------------------- |
| ULONG | Function start address |
| ULONG | Function end address   |
| ULONG | Unwind info address    |

可以看到，既可以指定一个handler，也可以不进行处理，而是使用链式的unwind info

下面写一个masm小程序

```assembly
; ml64 a.asm /link /entry:Example /SUBSYSTEM:CONSOLE


_text SEGMENT

myhandler PROC pExceptionRecord:PTR, pEstablisherFrame:PTR, pContextRecord:PTR, pDispatcherContext:PTR
   mov pExceptionRecord, rcx
   mov pEstablisherFrame, rdx
   mov pContextRecord, r8
   mov pDispatcherContext, r9
   mov rax, 12
   ret
myhandler ENDP


Example PROC FRAME:myhandler
   push rbp
.endprolog
   mov r8, 0
   div r8
   nop
   nop
Example ENDP
_text ENDS


END
```

（masm语法参见https://docs.microsoft.com/en-us/cpp/assembler/masm/directives-reference?view=msvc-160）

这个小程序仅仅是调用了myhandler函数，并没有实现什么`unwind`的操作

打开ida调试，可以看到在发生除零的硬件异常后，的的确确是调用了myhandler这个函数

我们再来看看这个handler函数的四个参数，即

`ExceptionRecord`, `EstablisherFrame`, `ContextRecord`, `DispatcherContext`

**ExceptionRecord**

```c
typedef struct _EXCEPTION_RECORD {
  DWORD                    ExceptionCode;
  DWORD                    ExceptionFlags;
  struct _EXCEPTION_RECORD *ExceptionRecord;
  PVOID                    ExceptionAddress;
  DWORD                    NumberParameters;
  ULONG_PTR                ExceptionInformation[EXCEPTION_MAXIMUM_PARAMETERS];
} EXCEPTION_RECORD;
```

有两个地方比较重要，一个是ExceptionCode，另一个就是ExceptionAddress

**EstablisherFrame**

不清楚

**ContextRecord**

非常庞大的结构体，参见https://docs.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-context

里面保存有一些异常发生的时候寄存器的值。

**DISPATCHER_CONTEXT** 

定义

```c
typedef struct _DISPATCHER_CONTEXT {
    ULONG64 ControlPc;
    ULONG64 ImageBase;
    PRUNTIME_FUNCTION FunctionEntry;
    ULONG64 EstablisherFrame;
    ULONG64 TargetIp;
    PCONTEXT ContextRecord;
    PEXCEPTION_ROUTINE LanguageHandler;
    PVOID HandlerData;
} DISPATCHER_CONTEXT, *PDISPATCHER_CONTEXT;
```

那么，具体的unwind到底是怎样操作的？

## Unwind procedure

当异常发生时，contextrecord被操作系统保存，然后开始调用异常分发逻辑：

1. 用context中的rip找到前面所提到的`RUNTIME_FUNCTION`。
2. 倘若没有找到一个合适的条目，那么这个函数就是一个叶函数，（也就是说，这个函数不会改变任何易失寄存器的值，包括rsp，因此，不存在栈上的分配，参见https://docs.microsoft.com/en-us/cpp/build/stack-usage?view=msvc-160#function-types），那么在[rsp]处的返回指针就会被保存到更新后的context里面，rsp+8，重复第一步（相当于返回到调用者的地址，在调用方的地址范围内找handler函数）
3. 如果找到了，rip可能在如下三个范围里面a) epilog b) prolog c) 异常处理程序可能涵盖的一处代码
   - 第一种情况，则认为该函数已经失去了控制权，接下来模拟执行epilog的剩余部分，并且更新上下文记录，最后重复步骤1
   - 第二种，则认为控制权尚未到达该函数，接下来根据unwind code数组来逐步返回函数调用之前的context
   - 第三种，控制权在该函数手上，若该函数具有异常处理程序（设置了`UNW_FLAG_EHANDLER`），则调用该处理程序.
4. 若`language-specific handler`返回了一个已处理的状态码，那么以原先的context继续执行。
5. 若不存在`language-specific handler`或者它返回了一个继续搜寻的状态码，那么，必须将context展开到调用方的状态。这可以通过unwind code数组实现。继续重复步骤1

当使用了链式的unwind info，仍然遵循这些基本步骤。唯一的区别是，当展开函数的prolog时，一旦到达数组末尾，将会继续遍历的找到整个链表的末尾。

masm也提供了一些宏和伪操作来帮助编写seh程序，具体参见https://docs.microsoft.com/en-us/cpp/build/exception-handling-x64?view=msvc-160#unwind-helpers-for-masm

```assembly
sampleFrame struct
    Fill     dq ?; fill to 8 mod 16
    SavedRdi dq ?; Saved Register RDI
    SavedRsi dq ?; Saved Register RSI
sampleFrame ends

sample2 PROC FRAME
    alloc_stack(sizeof sampleFrame)
    save_reg rdi, sampleFrame.SavedRdi
    save_reg rsi, sampleFrame.SavedRsi
    .end_prolog

; function body

    mov rsi, sampleFrame.SavedRsi[rsp]
    mov rdi, sampleFrame.SavedRdi[rsp]

; Here's the official epilog

    add rsp, (sizeof sampleFrame)
    ret
sample2 ENDP
```



[1]: https://www.codeproject.com/Articles/1212332/bit-Structured-Exception-Handling-SEH-in-ASM
[2]: https://docs.microsoft.com/en-us/cpp/build/exception-handling-x64?view=msvc-160