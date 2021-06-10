### gdb tricks

> Type [`info variables`](http://sourceware.org/gdb/current/onlinedocs/gdb/Symbols.html#index-info-variables-918) to list "All global and static variable names".
>
> Type [`info locals`](http://sourceware.org/gdb/current/onlinedocs/gdb/Frame-Info.html#index-info-locals-435) to list "Local variables of current stack frame" (names and values), including static variables in that function.
>
> Type [`info args`](https://sourceware.org/gdb/current/onlinedocs/gdb/Frame-Info.html#index-info-args) to list "Arguments of the current stack frame" (names and values).

```bash
set -g mouse on
```

### Stack Canary

https://github.com/torvalds/linux/blob/master/include/linux/sched.h#L858

`task_struct`

```c
#ifdef CONFIG_STACKPROTECTOR
	/* Canary value for the -fstack-protector GCC feature: */
	unsigned long			stack_canary;
#endif
```

