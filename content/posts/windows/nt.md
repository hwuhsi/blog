---
title: "Windows Kernel Programming setup"
date: 2021-06-14
update: 2021-06-14
categories: windows
publish: true
series: "windows"
---



## Prepare

before we begin to write some kernel code, first let's prepare for a kernel debugging environment.

Make sure 





I will use `vagrant` to automatically configure the virtual machine.

(reference: https://secret.club/2020/04/10/kernel_debugging_in_seconds.html, nice blog post by secret club)

first you must have vagrant installed. You can go to their website and download directly, or use `scoop`

```powershell
scoop install vagrant
```

then, if you are running vmware, you will also need a vagrant plugin to correctly work. (see page https://www.vagrantup.com/docs/providers/vmware/installation)

you can also download `Vagrant VMware Utility` from scoop using my scoop repository (https://github.com/hwuhsi/scoop),

```
scoop install vagrant-vmware
```

(need to run `vagrant-vmware-utility service install ` and `vagrant-vmware-utility certificate generate` manually)

 next, run

```pow
vagrant plugin install vagrant-vmware-desktop
```

then everything is prepared.

## Vagrant Up

it's time to write our `Vagrantfile`

choose an windows virtual machine here (https://app.vagrantup.com/boxes/search)

I would use `StefanScherer/windows_10`

in your workspace root directory,  create the `Vagrantfile`

```Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.guest = :windows		# tell Vagrant this is a Windows-based guest
  config.vm.communicator = "winrm"	# use winrm for management instead of ssh

  config.winrm.password = "vagrant"	# the credentials specified during OS install
  config.winrm.username = "vagrant"	
  config.vm.provider "vmware_desktop" do |v|
    v.gui = true
  end
  config.vm.define "win10" do |win10|
    win10.vm.box = "StefanScherer/windows_10"	# edit this to be the name of the box you created
    win10.vm.provision "shell", path: "guest/kdbg.bat"			# this batch file will be run inside the VM
    
    win10.vm.network :forwarded_port, guest: 49152, host: 49152		# expose kernel debugging port to host
  end
end
```

`gui` is not required, but i will use some graphic appications later.

then, create a folder named `guest`, and create a file `kdbg.bat`

```bash
bcdedit /debug on
bcdedit /dbgsettings net hostip:192.168.225.1 port:49152 key:1.1.1.1
shutdown /r /t 0
```

here, the hostip address is the address of host machine under `vmnet8`, if you do not change the default network settings.

just run `vagrant up`

then, run your `windbg`

```power
"C:\Program Files (x86)\Windows Kits\10\Debuggers\x64\windbg.exe" -k net:port=49152,key=1.1.1.1
```

(of course the new `windbg preview` can be used as well)

## Load Driver

run

```powershell
bcdedit /set nointegritychecks on; bcdedit /set testsigning on
```

to disable the driver integrity checks





















