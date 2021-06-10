

主要参考：https://www.youtube.com/watch?v=_3-OMUQTf_k&ab_channel=EF-TechMadeSimple

## 安装

首先去官网下载镜像。

https://www.archlinux.org/download/

然后用vb加载。（需要注意的是开启efi，）

进来之后发现只有终端。

视频中用到了ssh远程链接，我则直接省略了这个步骤。

先passwd改变密码。

```bash
timedatectl set-ntp true
```

然后需要加载gpt分区表。

输入

```bash
gdisk /dev/sda
```

输入n新建分区

sda1两个扇区，第一个默认，第二个200M

然后改变类型为ef00 efi system partition

sda2就全按照默认就好。

然后创建文件系统。

```bash
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/sda2
```

再然后挂载。

```bash
mount /dev/sda2 /mnt
mkdir -p /mnt/boot/efi
mount /dev/sda1 /mnt/boot/efi
```

接着安装

```bash
pacstrap /mnt base linux linux-firmware nano
```

接着arch-chroot /mnt

该一下时钟设置

```bash
timedatectl list-timezones | grep Asia/Shanghai
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

继续改语言

```bash
vim /etc/locale.gen
```

把要选的语言注释去掉就可以了。这里选择en_US.UTF-8  UTF-8

```bash
echo LANG=en_US.UTF-8 >> /etc/locale.conf
```

键盘布局我这里没有修改，并不影响使用。

再修改hostname

```bash
nano /etc/hostname
nano /etc/hosts
```

hosts填写

```plaintext
127.0.0.1	localhost
::1			localhost
127.0.1.1	hostname.localdomain	hostname
```

再改一下passwd

然后安装一堆软件。

```bash
pacman -S grub efibootmgr networkmanager network-manager-applet dialog os-prober mtools dosfstools base-devel linux-headers cups openssh git xdg-utils xdg-user-dirs virutalbox-guest-utils
```

等上一段时间。

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

再启动系统服务。

```bash
systemctl enable NetworkManager
systemctl enable sshd
systemctl enable org.cups.cupsd
```

接着创建用户

```bash
useradd -mG group user
passwd user
EDITOR=nano visudo
```

把带有%group ALL=(ALL) ALL那一行注释去掉。

然后exit

reboot

等待重启完毕，安装kde桌面环境

安装参考https://itsfoss.com/install-kde-arch-linux/

```bash
sudo pacman -S xf86-video-vmware xorg plasma plasma-wayland-session kde-applications 
```

这个安装过程相当漫长。

```bash
systemctl enable sddm.service
```

等待装完，reboot重启。
