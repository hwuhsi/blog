## Compile options 

```bash
CONFIG_FUNCTION_TRACER=y 
CONFIG_DYNAMIC_FTRACE=y
```



## How to access

```bash
/sys/kernel/debug/tracing/
```

Kernel parameter trace_event=kmem:kmalloc, kmem:kmalloc_node, kmem:kfree

trace_buf_size=1000000



 Enable events cd /sys/kernel/debug/tracing echo "kmem:kmalloc" > set_events echo "kmem:kmalloc_node" >> set_events echo "kmem:kfree" >> set_events ● Start tracing, do something, stop tracing echo "1" > tracing_on; do_something_interesting; echo "0" > tracing_on;



https://elinux.org/images/8/81/Elc2013_Garcia.pdf