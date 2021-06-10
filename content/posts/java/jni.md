---
title: "jni"

---



## JNI

in your java code, define these `native` methods, eg:

`private native void printMethod();`

then in your c or cpp source path

cmake

```cmake
cmake_minimum_required (VERSION 3.8)

find_package(JNI REQUIRED)
include_directories(${JNI_INCLUDE_DIRS})

add_library(javajni SHARED "javajni.cpp" "javajni.h")
```

```bash
java -h . com.company.Main
```

generate header file

```cpp
JNIEXPORT void JNICALL Java_com_company_Main_printMethod
(JNIEnv* env, jobject obj) {
    std::cout << "Native method called. Printing garbage." << std::endl;
}
```

the first argument `env` provides the methods to retrive infomation about arguments;

(in fact, the `env`argument stores tons of funtion pointers)

the second argument `obj` is the caller itself,  if the method is not `static`

```cpp
JNIEXPORT jstring JNICALL Java_com_company_Main_stringManipulator
(JNIEnv* env, jobject obj, jstring str, jobjectArray strObj1) {
    std::string s = env->GetStringUTFChars(str, NULL);
    std::cout << "argument: " << s << std::endl;
    for (int i = 0; i < env->GetArrayLength(strObj1); i++) {
        std::cout
            << env->GetStringUTFChars((jstring)env->GetObjectArrayElement(strObj1, (jsize)i), JNI_FALSE)
            << std::endl;
    }
    return env->NewStringUTF(s.data());
}
```

take another example.

actually, the definition of `class jstring` and other classes are all empty.

we can only use our  `env` to access it

now let's build our shared library file

remember to build release version, since in windows java won't provide debug version of dlls

now let's load the dll we have just built, and run the native method



```java
public class Main {
    static {
        try {
            System.load("/absolute/path/to/dll");
        }catch (UnsatisfiedLinkError error)
        {
            System.out.println("error");
        }

    }
    private native void printMethod();
    public void printUtil() { printMethod();  }
    public static void main(String[] args) {
        Main util = new Main();
        util.printUtil();
    }
```

