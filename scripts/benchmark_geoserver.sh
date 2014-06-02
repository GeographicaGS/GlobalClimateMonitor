#!/bin/bash
echo "Benchmarking 5 users";
ab -w -c 80 -n 80 "$1" > 80_80_5_usuarios.html;

echo "Benchmarking 10 users";
ab -w -c 160 -n 160 "$1" > 160_160_10_usuarios.html;

echo "Benchmarking 20 users";
ab -w -c 320 -n 320 "$1" > 320_320_20_usuarios.html;

echo "Benchmarking 40 users";
ab -w -c 640 -n 640 "$1" > 640_640_40_usuarios.html;
