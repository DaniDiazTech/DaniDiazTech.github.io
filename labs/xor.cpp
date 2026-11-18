#include "autodiff.hpp"
#include "check.hpp"
#include <array>
#include <random>
#include <iostream>
// A 2->4->1 tanh MLP; target values are -1,+1,+1,-1.
int main() {
    std::mt19937 rng(42);std::uniform_real_distribution<double> dist(-1,1);
    std::array<double,17> params;for(auto& p:params)p=dist(rng);
    const std::array<std::array<double,3>,4> data={{{0,0,-1},{0,1,1},{1,0,1},{1,1,-1}}};
    auto forward=[](Tape& t,const std::array<std::size_t,17>& p,double x,double y) {
        const auto ix=t.leaf(x),iy=t.leaf(y);
        std::array<std::size_t,4> h;
        for(std::size_t j=0;j<4;++j) h[j]=t.tanh(t.add(t.add(t.mul(ix,p[j*3]),t.mul(iy,p[j*3+1])),p[j*3+2]));
        auto out=p[16];for(std::size_t j=0;j<4;++j)out=t.add(out,t.mul(h[j],p[12+j]));
        return t.tanh(out);
    };
    double final_loss=0;
    for(int step=0;step<4000;++step) {
        Tape t;std::array<std::size_t,17> p;for(std::size_t i=0;i<p.size();++i)p[i]=t.leaf(params[i]);
        auto sum=t.leaf(0);
        for(auto row:data) {auto out=forward(t,p,row[0],row[1]);auto error=t.add(out,t.leaf(-row[2]));sum=t.add(sum,t.mul(error,error));}
        auto loss=t.mul(sum,t.leaf(.25));t.backward(loss);
        for(std::size_t i=0;i<params.size();++i)params[i]-=.05*t.nodes[p[i]].grad;
        final_loss=t.nodes[loss].value;
    }
    for(auto row:data) {Tape t;std::array<std::size_t,17> p;for(std::size_t i=0;i<p.size();++i)p[i]=t.leaf(params[i]);auto out=forward(t,p,row[0],row[1]);double y=t.nodes[out].value;require(y*row[2]>0,"XOR classification failed");std::cout<<row[0]<<" xor "<<row[1]<<" -> "<<y<<'\n';}
    require(final_loss<.01,"XOR loss too high");std::cout<<"XOR MSE="<<final_loss<<"; all four signs correct\n";
}
