

apic驱动有三种模式：`periodic` 	`one-shot` 是被所有的local apic支持的，第三种`TSC-Deadline mode`只被最近的cpu型号支持

## Periodic Mode

这种情况下，软件设定一个初始值，lapic逐步减少这个值直到为0，这时lapic向cpu发出中断请求。在这种模式下，lapic是以常数时间发出irq的，当前值以总线频率除以一个所谓`Divide Configuration Register`逐步减少。

## One-Shot

这种情况和periodic类似，只不过初始值不会得到重置，而是由软件设置。

## TSC-Deadline mode

这种情况与前面二者都不同，它并不是根据总线的频率，而是通过软件设置`deadline`，当cpu的时间戳的值大于这个deadline，lapic就会发出irq请求。这样，精度会比前面二者要高，因为是直接使用cpu的频率。

