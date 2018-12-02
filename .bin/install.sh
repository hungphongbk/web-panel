#!/usr/bin/env bash

if ! [ -x "$(command -v acme.sh)" ]; then
  echo 'Acme.sh haven\'t installed. Install it now!' >&2
  curl https://get.acme.sh | sh
  source ~/.bashrc
fi

acme.sh -h