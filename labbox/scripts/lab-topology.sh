#!/usr/bin/env bash
cat <<'EOF'
IDPS LabBox v0.1

        idps-client                           idps-web
        10.13.37.10                          10.13.37.20
             │                                    │
             │ eth0                               │ eth0
             │                                    │
        lab-client0 ───────── br-idps ───────── lab-web0
             ▲
             │
             └── observation interface for passive NIDS

Expected flow:
  10.13.37.10:any  ->  10.13.37.20:8080/TCP

Important:
  lab-client0 is a host-side veth interface.
  All client <-> web traffic crosses this interface.
  The first laboratory uses it as the observation point.

LabBox creates the network and HTTP service only.
Suricata must be installed and run by the student.
EOF
