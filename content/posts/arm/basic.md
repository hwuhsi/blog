---
title: "ARM architecture[1]"
date: 2021-05-10
update: 2021-05-10
draft: false
tags: "arm"
categories: "arm"
---



## Basic Idea

> notice: `aarch64` architecture , which was introduced in `archv8`, is different from`arm` 

### Arm32

(copied from wiki)

> The 32-bit ARM architecture (and the 64-bit architecture for the most part) includes the following RISC features:
>
> - [Load/store architecture](https://en.wikipedia.org/wiki/Load/store_architecture).
> - No support for [unaligned memory accesses](https://en.wikipedia.org/wiki/Data_structure_alignment) in the original version of the architecture. ARMv6 and later, except some microcontroller versions, support unaligned accesses for half-word and single-word load/store instructions with some limitations, such as no guaranteed [atomicity](https://en.wikipedia.org/wiki/Linearizability).[[95\]](https://en.wikipedia.org/wiki/ARM_architecture#cite_note-99)[[96\]](https://en.wikipedia.org/wiki/ARM_architecture#cite_note-100)
> - Uniform 16 × 32-bit [register file](https://en.wikipedia.org/wiki/Register_file) (including the program counter, stack pointer and the link register).
> - Fixed instruction width of 32 bits to ease decoding and [pipelining](https://en.wikipedia.org/wiki/Pipelining), at the cost of decreased [code density](https://en.wikipedia.org/wiki/Code_density). Later, the [Thumb instruction set](https://en.wikipedia.org/wiki/ARM_architecture#Thumb) added 16-bit instructions and increased code density.
> - Mostly single clock-cycle execution.

#### Registers

we can see that there are 16 regitsers on ARM architecture.

for 64bit, the number extents to 32.

some special purpose registers

- **R11** or the **Frame Pointer(FP) register** 

- **R12** or the **Intra Procedure (IP) Call register**

- **R13** or the **Stack Pointer (SP) register**

- **R14** or the **Link Register (LR)**

- **R15** or the **Program Counter (PC)**

- **CPSR** (= **Current Program Status Register)**

with these in mind, it's time to dive deeper to the **Instruction Set Arthitecture(ISA)**

#### Addressing Modes

### AArch64

#### Registers

- **r0-r7 are used for arguments and return values; additional arguments are on the stack**
- **For syscalls, the syscall number is in r8**
- **r9-r15 are for temporary values (may get trampled)**
- r16-r18 are used for intra-procedure-call and platform values (avoid)
- **The called routine is expected to preserve r19-r28 \**\* These registers are generally safe to use in your program.**
- r29 and r30 are used as the frame register and link register (avoid)
- Register '31' is one of two registers depending on the instruction context:
  - For instructions dealing with the stack, it is the stack pointer, named rsp
  - For all other instructions, it is a "zero" register, which returns 0 when read and discards data when written - named rzr (xzr, wzr)

### Condition code suffixes

| Suffix | Meaning                                   |
| :----- | :---------------------------------------- |
| `EQ`   | Equal                                     |
| `NE`   | Not equal                                 |
| `CS`   | Carry set (identical to HS)               |
| `HS`   | Unsigned higher or same (identical to CS) |
| `CC`   | Carry clear (identical to LO)             |
| `LO`   | Unsigned lower (identical to CC)          |
| `MI`   | Minus or negative result                  |
| `PL`   | Positive or zero result                   |
| `VS`   | Overflow                                  |
| `VC`   | No overflow                               |
| `HI`   | Unsigned higher                           |
| `LS`   | Unsigned lower or same                    |
| `GE`   | Signed greater than or equal              |
| `LT`   | Signed less than                          |
| `GT`   | Signed greater than                       |
| `LE`   | Signed less than or equal                 |
| `AL`   | Always (this is the default)              |

### Branch

B

jmp to address

BL

can be used to do function call.

The `BL` instruction causes a branch to `label`, and copies the address of the next instruction into LR (`R14`, the link register).

### Stack

see https://www.keil.com/support/man/docs/armasm/armasm_dom1359731152499.htm

```assembly
STMFD    sp!, {r0-r5}  ; Push onto a Full Descending Stack
LDMFD    sp!, {r0-r5}  ; Pop from a Full Descending Stack
```

### Load/Store

ldr

load memory to register

str

store register into memory

## Assembly

### General Setup

in ubuntu, download cross compiler from package manager 

```bash
sudo apt install gcc-aarch64-linux-gnu qemu-user
```

now, you can run arm binary on your x86 machine.

you can run directly from command line if your program is statically linked.

(with the help of binfmt component)

if it's dynamically linked, add an environment variable

```bash
QEMU_LD_PREFIX=/usr/arm-linux-gnueabihf ./app
```

or by executing qemu

```bash
qemu-aarch64 -L/usr/arm-linux-gnueabihf ./app
```

building arm binary is as easy as executing the following command

```bash
aarch64-linux-gnu-gcc app.c
```

> **notice**: if you want to debug your program, please use `qemu-aarch64` instead of env.
>
> append `-g port` to command line to debug your app.

### ABI

https://github.com/ARM-software/abi-aa/releases

https://developer.arm.com/documentation/ihi0042/latest/

before we really look at the redundancy spec, let's first take a quick example by examining what gcc tells us.

```makefile
CROSS := aarch64-linux-gnu-

%.s: %.c
	$(CROSS)gcc -S $< -o $@

%: %.c
	$(CROSS)gcc $< -o $@
```

```c
#include <stdio.h>
#include <stdint.h>

uint64_t add(uint64_t a, uint64_t b) {
    return a + b;
}


int main() {
    printf("%lu\n", add(1, 2));
}
```

run

```bash
make test.s
```

we get the output file

```assembly
	.arch armv8-a
	.file	"a.c"
	.text
	.align	2
	.global	add
	.type	add, %function
add:
.LFB0:
	.cfi_startproc
	sub	sp, sp, #16
	.cfi_def_cfa_offset 16
	str	x0, [sp, 8]
	str	x1, [sp]
	ldr	x1, [sp, 8]
	ldr	x0, [sp]
	add	x0, x1, x0
	add	sp, sp, 16
	.cfi_def_cfa_offset 0
	ret
	.cfi_endproc
.LFE0:
	.size	add, .-add
	.section	.rodata
	.align	3
.LC0:
	.string	"%lu\n"
	.text
	.align	2
	.global	main
	.type	main, %function
main:
.LFB1:
	.cfi_startproc
	stp	x29, x30, [sp, -16]!
	.cfi_def_cfa_offset 16
	.cfi_offset 29, -16
	.cfi_offset 30, -8
	mov	x29, sp
	mov	x1, 2
	mov	x0, 1
	bl	add
	mov	x1, x0
	adrp	x0, .LC0
	add	x0, x0, :lo12:.LC0
	bl	printf
	mov	w0, 0
	ldp	x29, x30, [sp], 16
	.cfi_restore 30
	.cfi_restore 29
	.cfi_def_cfa_offset 0
	ret
	.cfi_endproc
.LFE1:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 10.3.0-1ubuntu1) 10.3.0"
	.section	.note.GNU-stack,"",@progbits
```

## Exploit

ref

https://azeria-labs.com/

https://developer.arm.com/documentation/102374/latest/

https://www.keil.com/support/man/docs/armasm/armasm_dom1361289850039.htm

https://www.cs.uregina.ca/Links/class-info/301/

https://en.wikipedia.org/wiki/Calling_convention#ARM_(A64)

some examples 

https://github.com/bkerler/exploit_me