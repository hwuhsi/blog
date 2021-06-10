https://github.com/LordNoteworthy/al-khaser/blob/master/al-khaser/TimingAttacks/timing.cpp

https://docs.microsoft.com/en-us/cpp/intrinsics/rdtscp?view=msvc-160

## RDTSC

```c++
#define LODWORD(_qw)    ((DWORD)(_qw))
BOOL rdtsc_diff_locky()
{
	ULONGLONG tsc1;
	ULONGLONG tsc2;
	ULONGLONG tsc3;
	DWORD i = 0;

	// Try this 10 times in case of small fluctuations
	for (i = 0; i < 10; i++)
	{
		tsc1 = __rdtsc();

		// Waste some cycles - should be faster than CloseHandle on bare metal
		GetProcessHeap();

		tsc2 = __rdtsc();

		// Waste some cycles - slightly longer than GetProcessHeap() on bare metal
		CloseHandle(0);

		tsc3 = __rdtsc();

		// Did it take at least 10 times more CPU cycles to perform CloseHandle than it took to perform GetProcessHeap()?
		if ((LODWORD(tsc3) - LODWORD(tsc2)) / (LODWORD(tsc2) - LODWORD(tsc1)) >= 10)
			return FALSE;
	}

	// We consistently saw a small ratio of difference between GetProcessHeap and CloseHandle execution times
	// so we're probably in a VM!
	return TRUE;
}
```





```c++
#include <WinSock2.h>
#include <iphlpapi.h>
#include <icmpapi.h>
#include <stdio.h>

#pragma comment(lib, "iphlpapi.lib")
#pragma comment(lib, "ws2_32.lib")


BOOL timing_IcmpSendEcho(UINT delayInMillis)
{

	HANDLE hIcmpFile;
	unsigned long DestinationAddress = INADDR_NONE;
	char SendData[32] = "Data Buffer";
	LPVOID ReplyBuffer = NULL;
	DWORD ReplySize = 0;
	const char ipaddr[] = "224.0.0.0";

	hIcmpFile = IcmpCreateFile();
	if (hIcmpFile == INVALID_HANDLE_VALUE) {
		printf("\tUnable to open handle.\n");
		printf("IcmpCreatefile returned error: %u\n", GetLastError());
		return TRUE;
	}

	//
	// Size of ICMP_ECHO_REPLY + size of send data + 8 extra bytes for ICMP error message
	//
	ReplySize = sizeof(ICMP_ECHO_REPLY) + sizeof(SendData) + 8;
	ReplyBuffer = (VOID*)malloc(ReplySize);
	if (ReplyBuffer == NULL) {
		IcmpCloseHandle(hIcmpFile);
		printf("\tUnable to allocate memory\n");
		return TRUE;
	}

	IcmpSendEcho(hIcmpFile, DestinationAddress, SendData, sizeof(SendData), NULL, ReplyBuffer, ReplySize, delayInMillis);
	IcmpCloseHandle(hIcmpFile);
	free(ReplyBuffer);

	return FALSE;
}

int main()
{
	printf("%d\n", timing_IcmpSendEcho(600 * 1000));
}
```

the code will execute 10 minutes later, which can hide from debugger

(this technique is firstly used in `ccleaner` malware)



