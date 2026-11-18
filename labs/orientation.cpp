#include "check.hpp"
#include <iostream>
#include <vector>
double dot(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size()!=b.size()) throw std::invalid_argument("dot: lengths differ");
    double out=0;
    for (std::size_t i=0;i<a.size();++i) out+=a[i]*b[i];
    return out;
}
int main() {
    near(dot({1,2},{3,4}),11);
    near(dot({-1,0},{2,7}),-2);
    near(dot({},{}),0);
    bool rejected=false;
    try { dot({1},{1,2}); } catch(const std::invalid_argument&) { rejected=true; }
    require(rejected,"length mismatch was accepted");
    std::cout << "dot=11; empty, negative, and mismatch tests pass\n";
}
