syscall伪代码

```plaintext
IF (CS.L ≠ 1 ) or (IA32_EFER.LMA ≠ 1) or (IA32_EFER.SCE ≠ 1)
  THEN #UD;
FI;
RCX ← RIP;
RIP ← IA32_LSTAR;
R11 ← RFLAGS;
RFLAGS ← RFLAGS AND NOT(IA32_FMASK);
CS.Selector ← IA32_STAR[47:32] AND FFFCH
CS.Base ← 0;
CS.Limit ← FFFFFH;
CS.Type ← 11;
CS.S ← 1;
CS.DPL ← 0;
CS.P ← 1;
CS.L ← 1;
CS.D ← 0;
CS.G ← 1;
CPL ← 0;
SS.Selector ← IA32_STAR[47:32] + 8;
SS.Base ← 0;
SS.Limit ← FFFFFH;
SS.Type ← 3;
SS.S ← 1;
SS.DPL ← 0;
SS.P ← 1;
SS.B ← 1;
SS.G ← 1;
```

关键位置有两处

> RCX ← RIP;
> RIP ← IA32_LSTAR;

即将返回地址写入`rcx`，并从IA32_LSTAR读取`rip`