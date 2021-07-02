---
title: "FileSystem  Filter - AvScan"
date: 2021-06-20
update: 2021-06-20
categories: "kernel"
---

https://github.com/microsoft/Windows-driver-samples/tree/master/filesys/miniFilter/avscan

## DriverEntry

Some initialization stuff .

Then 

![function](https://i.loli.net/2021/06/20/Cmexi2Iu7oaMPER.png)



What is FltRegisterFilter? From msdn:

```c++
NTSTATUS FLTAPI FltRegisterFilter(
  PDRIVER_OBJECT         Driver,
  const FLT_REGISTRATION *Registration,
  PFLT_FILTER            *RetFilter
);
```

the driver object is the first argument of driverenty, and `FLT_REGISTRATION`  is a struct, the third argument is the return value.

```c++
typedef struct _FLT_REGISTRATION {
  USHORT                                      Size;
  USHORT                                      Version;
  FLT_REGISTRATION_FLAGS                      Flags;
  const FLT_CONTEXT_REGISTRATION              *ContextRegistration;
  const FLT_OPERATION_REGISTRATION            *OperationRegistration;
  PFLT_FILTER_UNLOAD_CALLBACK                 FilterUnloadCallback;
  PFLT_INSTANCE_SETUP_CALLBACK                InstanceSetupCallback;
  PFLT_INSTANCE_QUERY_TEARDOWN_CALLBACK       InstanceQueryTeardownCallback;
  PFLT_INSTANCE_TEARDOWN_CALLBACK             InstanceTeardownStartCallback;
  PFLT_INSTANCE_TEARDOWN_CALLBACK             InstanceTeardownCompleteCallback;
  PFLT_GENERATE_FILE_NAME                     GenerateFileNameCallback;
  PFLT_NORMALIZE_NAME_COMPONENT               NormalizeNameComponentCallback;
  PFLT_NORMALIZE_CONTEXT_CLEANUP              NormalizeContextCleanupCallback;
  PFLT_TRANSACTION_NOTIFICATION_CALLBACK      TransactionNotificationCallback;
  PFLT_NORMALIZE_NAME_COMPONENT_EX            NormalizeNameComponentExCallback;
  PFLT_SECTION_CONFLICT_NOTIFICATION_CALLBACK SectionNotificationCallback;
} FLT_REGISTRATION, *PFLT_REGISTRATION;
```

 a bit compicated.

`ContextRegistration` field

it shows which context the filter uses.

![image-20210620102214400](https://i.loli.net/2021/06/20/5r2s61yN7xwDvuW.png)

so, what is a `context`?

according to microsoft docs (https://docs.microsoft.com/en-us/windows-hardware/drivers/ifs/managing-contexts-in-a-minifilter-driver), 

> A *context* is a structure that is defined by the minifilter driver and that can be associated with a filter manager object. The filter manager provides support that allows minifilter drivers to associate contexts with objects to preserve state across I/O operations.

![](https://raw.githubusercontent.com/hwuhsi/images/main/images/2021/06/image-20210629134700452.png)

