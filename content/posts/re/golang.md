---
title: "golang binary analysis"
date: 2021-05-21
draft: true
---

https://github.com/golang/go/issues/40724

https://dr-knz.net/categories/

https://blog.osiris.cyber.nyu.edu/2019/12/19/ugo-ghidra-plugin/

https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part1.html

https://morsmachine.dk/go-scheduler

https://rakyll.org/scheduler/

https://lessisbetter.site/2019/04/04/golang-scheduler-3-principle-with-graph/

https://zhuanlan.zhihu.com/p/102562318

https://dr-knz.net/go-calling-convention-x86-64.html#id19

the calling convention of `go` programming language is based on **stack**.







https://dr-knz.net/go-calling-convention-x86-64.html





example:

```go
package main

func fun1(a, b int) (int, int) {
	return a - b, a + b
}

func main() {
	fun1(32, 21)
}
```

what will stack be like?





`string` in go

```go
type StringHeader struct {
	Data uintptr
	Len  int
}
```

`slice` in go

```go
type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```





```go
package main

import "fmt"

func fibonacci(c, quit chan int) {
	x, y := 0, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}

func main() {
	c := make(chan int)
	quit := make(chan int)
	go func() {
		for i := 0; i < 10; i++ {
			fmt.Println(<-c)
		}
		quit <- 0
	}()
	fibonacci(c, quit)
}
```

here,  `make` will become `runtime_makechan` , which takes two arguments, and return a pointer to `hchan`

```go
func makechan(t *chantype, size int) *hchan {
    //...
}
```

`chantype`

