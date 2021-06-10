typical windows process address space 

| Partition   | x32                   | x64                                   |
| ----------- | --------------------- | ------------------------------------- |
| null ptr    | 0x00000000-0x0000ffff | 0x0000000000000000-0x000000000000ffff |
| user        | 0x00010000-0x7ffeffff |                                       |
| 64kb        |                       |                                       |
| kernel mode |                       |                                       |



### Working Set

see also https://docs.microsoft.com/en-us/windows/win32/memory/working-set



windows memory manager是整个windows可执行程序的一部分，因此存在于Ntoskrnl.exe之中。内存管理是这个可执行程序最大的一部分，因此相对复杂。分成以下部分。

- 分配、回收、管理内存
- 缺页异常
- 六个关键的组件，每个都独立运行在一个内核线程中：
  - The balance set manager (KeBalanceSetManager, priority 17)
  - The process/stack swapper (KeSwapProcessOrStack, priority 23)
  - The modified page writer (MiModifiedPageWriter, priority 18)
  - The mapped page writer (MiMappedPageWriter, priority 18)
  - The segment dereference thread (MiDereferenceSegmentThread, priority 19)
  - The zero page thread (MiZeroPageThread, priority 0)

## memory manager 提供的服务

有以下四类

- Virtual Api

  最底层的api，作用于内存页粒度。同时也是最强大的api，支持完整的memory manager功能。函数例如`VirtualAlloc`, `VirtualFree`, `VirtualProtect`, `VirtualLock`等

- Heap Api

  提供较小的内存分配（小于一个内存页）。其由virtual api实现，同时在其上实现了管理的功能。函数例如`HeapAlloc`, `HeapFree`, `HeapCreate`, `HeapReAlloc`

- Local/Global Apis

  16位系统遗留下来的api

- Memory-Mapped files

  能够将文件映射为内存或者实现进程间的共享内存。函数包括`CreateFileMapping`, `OpenFileMapping`, `MapViewOfFile`



