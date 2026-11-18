#include "autodiff.hpp"
#include "check.hpp"
#include <iostream>
int main() {
    Tape t;
    auto a=t.leaf(2),b=t.leaf(-3),c=t.leaf(10);
    auto u=t.add(t.mul(a,b),c),loss=t.mul(u,u);
    t.backward(loss);
    near(t.nodes[loss].value,16);near(t.nodes[a].grad,-24);near(t.nodes[b].grad,16);near(t.nodes[c].grad,8);
    Tape shared;
    auto x=shared.leaf(3),square=shared.mul(x,x),root=shared.add(square,square);
    shared.backward(root);near(shared.nodes[x].grad,12);
    shared.backward(root);near(shared.nodes[x].grad,12);
    const double h=1e-5;
    auto f=[](double v){return 2*v*v;};
    near(shared.nodes[x].grad,(f(3+h)-f(3-h))/(2*h),1e-6);
    std::cout<<"leaf gradients=(-24,16,8); shared-node gradient=12; reset and finite differences pass\n";
}
