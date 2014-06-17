#!/bin/bash
uwsgi -s /tmp/globalclimate.org_api_uwsgi.sock -w api:app --chown-socket=www-data:www-data
