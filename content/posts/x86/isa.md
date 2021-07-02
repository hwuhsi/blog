---
title: "x86 instruction set architecture"
---

## Instruction Format

![image-20210627210504709](https://i.loli.net/2021/06/27/PYXJ8F5BMGhijyv.png)

(copied from intel manual)

the `REX Prefix` is 64 bit mode specific.

example:

```python
from keystone import *


CODE = b"mov rax, 0"


ks = Ks(KS_ARCH_X86, KS_MODE_64)
encoding, count = ks.asm(CODE)

r = ""

for i in encoding:
    r += "%02x " % i

print(r)
```

we get output:

> 48 c7 c0 00 00 00 00

here, `48` is the rex prefix (`REX.W`), meaning it is extended to 64 bit size;

c7 is the opcode,

`c0` is ModR/M bit. 

![image-20210627215831920](https://i.loli.net/2021/06/27/AlaKH5GQv8XtbIR.png)

we can find the value from the figure. The `Mod` is `11` and the `R/M` is `000 `

the rest is imm value: `0`

| Instruction        | Opcode             | Op/En | 64-Bit Mode | Compat/Leg Mode | Description                                       |
| ------------------ | ------------------ | ----- | ----------- | --------------- | ------------------------------------------------- |
| MOV *r/m64, imm32* | REX.W + C7 /*0 id* | MI    | Valid       | N.E.            | Move *imm32 sign extended to 64-bits* to *r/m64.* |

(https://www.felixcloutier.com/x86/mov)

here, /0 just means /digit in the above figure.

so, it seems that the assembler tries to minimize the output size by limiting the operand to 32 bit.

what if we give it a 64 bit immediate value? Or a negative value?

```python
from keystone import *


CODE = b"mov rax, 0x1234567812345678; mov rax, -1"


ks = Ks(KS_ARCH_X86, KS_MODE_64)
encoding, count = ks.asm(CODE)

r = ""

for i in encoding:
    r += "%02x " % i

print(r)
```

output:

> 48 b8 78 56 34 12 78 56 34 12
> 
> 48 c7 c0 ff ff ff ff

now you see the difference. `b8` and `c7` are different operand. Thus they do different operations.

| Opcode              | Instruction      | Op/En | 64-Bit Mode | Compat/Leg Mode | Description            |
| ------------------- | ---------------- | ----- | ----------- | --------------- | ---------------------- |
| REX.W + B8+ *rd io* | MOV *r64, imm64* | OI    | Valid       | N.E.            | Move *imm64* to *r64.* |

