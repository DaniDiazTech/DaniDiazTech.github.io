#include "check.hpp"
#include <iostream>
double loss(double w) { return (w-3)*(w-3); }
double grad(double w) { return 2*(w-3); }
int main() {
    constexpr double h=1e-5;
    for (double w : {-2.0,0.0,3.0,6.0}) near(grad(w),(loss(w+h)-loss(w-h))/(2*h),1e-7);
    double w=0, previous=loss(w);
    for(int i=0;i<80;++i) {
        w-=.1*grad(w);
        require(loss(w)<=previous,"loss increased");
        previous=loss(w);
        if(i<5) std::cout<<"step="<<i+1<<" w="<<w<<" loss="<<loss(w)<<'\n';
    }
    near(w,3,1e-6);
    near(0-.1*grad(0),.6);
    near(loss(0-1.0*grad(0)),loss(0));
    std::cout<<"gradient checks and convergence pass\n";
}
