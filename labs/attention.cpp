#include "check.hpp"
#include <array>
#include <algorithm>
#include <iostream>
using Row=std::array<double,3>;using Matrix=std::array<Row,3>;
Matrix causal_attention(const Matrix& q,const Matrix& k,const Matrix& v) {
    Matrix out{};
    for(std::size_t i=0;i<3;++i){Row scores{},weights{};double m=-1e100;
        for(std::size_t j=0;j<=i;++j){for(std::size_t d=0;d<3;++d)scores[j]+=q[i][d]*k[j][d]/std::sqrt(3.0);m=std::max(m,scores[j]);}
        double sum=0;for(std::size_t j=0;j<=i;++j){weights[j]=std::exp(scores[j]-m);sum+=weights[j];}
        for(std::size_t j=0;j<=i;++j)for(std::size_t d=0;d<3;++d)out[i][d]+=weights[j]/sum*v[j][d];
    }return out;
}
int main(){Matrix q={{{1,0,0},{0,1,0},{0,0,1}}},k=q,v={{{1,2,3},{4,5,6},{7,8,9}}};auto out=causal_attention(q,k,v);
    for(std::size_t d=0;d<3;++d)near(out[0][d],v[0][d]);
    auto changed=v;changed[2]={1000,2000,3000};auto out2=causal_attention(q,k,changed);
    for(std::size_t i=0;i<2;++i)for(std::size_t d=0;d<3;++d)near(out[i][d],out2[i][d]);
    require(std::abs(out[2][0]-out2[2][0])>1,"last position ignored its own value");
    std::cout<<"causal attention: position 0 equals its own value; future-value perturbation leaves earlier outputs unchanged\n";
}
