SysIp = Socket.ip_address_list.detect{|intf| intf.ipv4_private?}.ip_address