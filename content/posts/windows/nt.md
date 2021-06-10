

内核函数

| Prefix |                           Meaning                            |
| :----: | :----------------------------------------------------------: |
|   Cc   | File system cache[[2\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-3) |
|   Cm   | Configuration Manager, the kernel mode side of [Windows Registry](https://en.wikipedia.org/wiki/Windows_Registry) |
|  Csr   | functions used to communicate with the Win32 subsystem process, csrss.exe (csrss stands for client/server runtime sub-system) |
|  Dbg   |   debugging aid functions, such as a software break point    |
|   Ex   |     Windows executive, an "outer layer" of Ntoskrnl.exe      |
|  Exp   | Windows executive private: Routines within the executive layer that are not exported for call outside of the executive (p = private) |
| FsRtl  | file system runtime library[[3\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-4) |
|   Io   | I/O manager[[4\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-5) |
|   Ke   | core kernel routines[[5\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-6) |
|   Ki   | routines in the kernel that are not exported for call from outside the kernel (i = internal) |
|   Ks   |                       kernel streaming                       |
|  Ldr   |            loader functions for PE file handling             |
|  Lpc   | [Local Procedure Call](https://en.wikipedia.org/wiki/Local_Inter-Process_Communication), an internal, undocumented, interprocess or user/kernel message passing mechanism |
|  Lsa   |                   Local Security Authority                   |
|   Mi   | memory management routines not exported for call outside the memory manager (i = internal) |
|   Mm   |                      memory management                       |
|  Nls   |   Nls for Native Language Support (similar to code pages).   |
|   Ob   | [Object Manager](https://en.wikipedia.org/wiki/Object_Manager) |
|  Pfx   |                   Pfx for prefix handling.                   |
|   Po   | Plug-and-play and power management[[6\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-7) |
|   Ps   |                Process and thread management                 |
|  Rtl   | Run-Time Library. This includes many utility functions that can be used by native applications, yet don't directly involve kernel support |
|  Rtlp  | Run-Time Library internal routines that are not exported form the kernel. |
|   Se   |                           security                           |
|   Vf   |                       Driver verifier                        |
|   Vi   | Driver verifier routines not exported for call outside the driver verifier |
|   Zw   | Nt or Zw are system calls declared in ntdll.dll and ntoskrnl.exe. When called from ntdll.dll in user mode, these groups are almost exactly the same; they trap into kernel mode and call the equivalent function in ntoskrnl.exe via the SSDT. When calling the functions directly in ntoskrnl.exe (only possible in kernel mode), the Zw variants ensure kernel mode, whereas the Nt variants do not.[[7\]](https://en.wikipedia.org/wiki/Ntoskrnl.exe#cite_note-8) |

