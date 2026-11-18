#include "check.hpp"
#include <array>
#include <random>
#include <iostream>
#include <string>
int main(){
    // Original tiny corpus; '.' is an explicit end-of-sequence token.
    const std::string corpus="aba.aba.aca.",vocab=".abc";constexpr std::size_t V=4;
    std::array<std::array<double,V>,V> counts{},p{};for(auto& r:counts)r.fill(1); // Add-one smoothing.
    std::size_t prev=0;
    for(char ch:corpus){auto next=vocab.find(ch);require(next<V,"unknown byte");counts[prev][next]+=1;prev=next;}
    for(std::size_t i=0;i<V;++i){double sum=0;for(auto c:counts[i])sum+=c;double check=0;for(std::size_t j=0;j<V;++j){p[i][j]=counts[i][j]/sum;check+=p[i][j];}near(check,1);}
    // Fixed held-out example; no model selection is performed on it.
    double nll=0;prev=0;const std::string heldout="aca.";
    for(char ch:heldout){auto next=vocab.find(ch);nll-=std::log(p[prev][next]);prev=next;}nll/=heldout.size();require(std::isfinite(nll),"nonfinite evaluation");
    std::mt19937 rng(42);prev=0;std::cout<<"sample=";
    for(int i=0;i<40;++i){std::discrete_distribution<std::size_t>d(p[prev].begin(),p[prev].end());auto next=d(rng);std::cout<<vocab[next];prev=next;if(!next)break;}
    std::cout<<"\nheld-out mean NLL="<<nll<<" nats; PPL="<<std::exp(nll)<<'\n';
}
