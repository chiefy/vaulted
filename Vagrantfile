# -*- mode: ruby -*-
# vi: set ft=ruby :

def which(cmd)
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each { |ext|
      exe = File.join(path, "#{cmd}#{ext}")
      return exe if File.executable?(exe) && !File.directory?(exe)
    }
  end
  return nil
end

if Vagrant::Util::Platform.windows? && which('cygpath') != nil
  ENV["VAGRANT_DETECTED_OS"] = ENV["VAGRANT_DETECTED_OS"].to_s + " cygwin"
end

$script = <<SCRIPT
# use the current repo for installing docker
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get purge -y lxc-docker*

# seems to be an issue when using docker-compose --x-networking and docker 1.9.1 so set to 1.9.0 for now
apt-get install -y docker-engine=1.9.0-0~trusty build-essential g++

if hash pip 2>/dev/null; then
    pip install -U pip
else
    curl -sSL https://bootstrap.pypa.io/get-pip.py | python
fi
pip -q install -U docker-compose
curl -sSL https://raw.githubusercontent.com/docker/compose/master/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose

curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
apt-get install --yes nodejs
SCRIPT

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.hostname = "vaulted-dev"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.

  # used to expose code coverage and documentation for project
  config.vm.network "forwarded_port", guest: 8080, host: 18080

  config.vm.synced_folder ".", "/home/vagrant/vaulted", type: "rsync", rsync__exclude: [".venv/", "node_modules/", "coverage/"]

  config.vm.provision "docker" do |d|
    # pull down base images
    d.pull_images "alpine:3.2"
    d.pull_images "node:4"
    d.pull_images "nginx:1.9.5"
    d.pull_images "kenjones/authstore-consul"
    d.pull_images "kenjones/authstore-vault"
    d.pull_images "kenjones/nodejs-mocha"
  end

  # make it so your git will continue to work even within the VM
  config.vm.provision "file", source: "~/.gitconfig", destination: ".gitconfig"
  config.vm.provision "file", source: "~/.ssh/id_rsa", destination: ".ssh/id_rsa"
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: ".ssh/id_rsa.pub"

  config.vm.provision "shell", inline: $script

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  config.vm.provider "virtualbox" do |vb|
    # Don't boot with headless mode
    # vb.gui = true

    # Specify number of CPUs
    # vb.cpus = 2

    # Specify amount of memory
    vb.memory = 1024

    # resolves intermittent connectivity within VM
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]

    # Customize the max CPU utillization on physical host (max 50%)
    # vb.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
  end

end
