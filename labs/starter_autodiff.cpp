#include "check.hpp"
#include <iostream>
#include <vector>
// Assignment: use arena indices so moving storage cannot invalidate parent links.
// Add operations, backward rules, and either a topological traversal or append-only ordering.
struct Value { double data=0,grad=0; std::vector<std::size_t> parents; };
int main() {
    std::cout << "Implement add/multiply and backward; then test u=x*x,L=u+u at x=3.\n";
    std::cout << "Expected derivative: 12. Compare against centered differences.\n";
    return 1; // Deliberately incomplete: do not treat a printed message as a passed lab.
}
