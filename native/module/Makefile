# Host-side tests (x86_64): hook engine on a real shared object with BIND_NOW+RELRO, and the config contract.
# JAVA_CFG: optional config text produced by the Java overlay (cross-language contract).
JAVA_CFG ?=
test:
	cd tests && gcc -shared -fPIC -O1 -Wl,-z,now -Wl,-z,relro -Wl,--build-id target_lib.c -o libtarget.so
	cd tests && g++ -std=c++17 -O1 -Wall -Wextra hook_test.cpp ../jni/hook.cpp -ldl -o hook_test && ./hook_test
	cd tests && g++ -std=c++17 -O1 -Wall -Wextra config_test.cpp -o config_test && ./config_test $(JAVA_CFG)
	cd tests && g++ -std=c++17 -O1 -Wall -Wextra patch_test.cpp -o patch_test && ./patch_test
	cd tests && g++ -std=c++17 -O1 -Wall -Wextra dpmath_test.cpp -o dpmath_test && ./dpmath_test
	cd tests && g++ -std=c++17 -O1 -Wall -Wextra fxrt_test.cpp -o fxrt_test && ./fxrt_test ../../../shader/fx-es
	rm -f tests/fxrt_test tests/dpmath_test tests/patch_test tests/hook_test tests/config_test tests/libtarget.so
