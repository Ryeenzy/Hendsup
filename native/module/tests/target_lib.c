#include <stdio.h>
#include <string.h>
// Imports strlen via PLT; the test hooks that slot.
size_t target_call(const char* s) { return strlen(s); }
