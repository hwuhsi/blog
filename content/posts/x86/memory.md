---
title: "x86内存管理"
date: 2021-1-20
update: 2021-1-20
---

## Paging

分页使得虚拟地址和物理地址被分成一个个的小块。

如此一来，便能够避免分段式的内存导致的第三块虚拟内存区域无法分配的问题。虚拟地址中的一个块就叫做`page`,物理地址中的一个块叫做`frame`。

## Page Table

内存分页技术使用一种所谓**页表**的区域来表示内存页的信息。

![Three page tables, one for each program instance. For instance 1 the mapping is 0->100, 50->150, 100->200. For instance 2 it is 0->300, 50->350, 100->400. For instance 3 it is 0->250, 50->450, 100->500.](https://os.phil-opp.com/paging-introduction/paging-page-tables.svg)

可以看到，每个程序都有属于自己的页表。cpu中有专门的寄存器**cr3**来保存页表位置。一般来说，由操作系统负责改变cr3的值。

## 多级页表

倘若内存比较大，直接使用页表是很麻烦的。一般来说默认的page大小不会很大，因为有些程序并不会用到很多内存，给太多内存是一种浪费；与此同时，若机器中的内存空间很大，就不得不花费大量的空间来保存页表，那样同时也会伴随着运行时间的代价，页表也会出现大量的空缺，这是极大的浪费。因此，x86架构使用了所谓**多级页表**的技术。

![Page 0 points to entry 0 of the level 2 page table, which points to the level 1 page table T1. The first entry of T1 points to frame 0, the other entries are empty. Pages 1_000_000–1_000_150 point to the 100th entry of the level 2 page table, which points to a different level 1 page table T2. The first three entries of T2 point to frames 100–250, the other entries are empty.](https://os.phil-opp.com/paging-introduction/multilevel-page-table.svg)

x86_64实际上使用了四级的页表（最新的十代酷睿可以使用五级页表，但是目前还只是实验性的）。每个内存页的大小为4kiB。每一级都有512的条目，每个条目是8个字节。因此，每级页表的大小为 512 * 8B = 4KiB，而这正好是一个内存页的大小。

![Bits 0–12 are the page offset, bits 12–21 the level 1 index, bits 21–30 the level 2 index, bits 30–39 the level 3 index, and bits 39–48 the level 4 index](https://os.phil-opp.com/paging-introduction/x86_64-table-indices-from-address.svg)

可以看到，实际上x86_64架构只能够使用2^48的内存，余下的48-64实际上并未使用。不过，这剩下的几位的值必须为第47位的符号拓展，否则cpu会出错。

在此情况下，第四级的页表的根条目的地址存储在前面提到的**cr3**寄存器里面。

