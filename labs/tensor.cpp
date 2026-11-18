#include "check.hpp"
#include <vector>
#include <iostream>
#include <algorithm>
struct Matrix {
    std::size_t rows,cols; std::vector<double> values;
    Matrix(std::size_t r,std::size_t c):rows(r),cols(c),values(r*c) {}
    double& at(std::size_t i,std::size_t j){if(i>=rows||j>=cols)throw std::out_of_range("matrix index");return values.at(i*cols+j);}
    double at(std::size_t i,std::size_t j)const{if(i>=rows||j>=cols)throw std::out_of_range("matrix index");return values.at(i*cols+j);}
};
Matrix matmul(const Matrix& a,const Matrix& b) {
    if(a.cols!=b.rows)throw std::invalid_argument("matmul inner dimensions differ");
    Matrix c(a.rows,b.cols);
    for(std::size_t i=0;i<a.rows;++i)for(std::size_t k=0;k<a.cols;++k)for(std::size_t j=0;j<b.cols;++j)c.at(i,j)+=a.at(i,k)*b.at(k,j);
    return c;
}
std::vector<double> softmax(const std::vector<double>& z) {
    if(z.empty())throw std::invalid_argument("empty softmax");
    auto m=*std::max_element(z.begin(),z.end());std::vector<double> p;double s=0;
    for(auto v:z){p.push_back(std::exp(v-m));s+=p.back();}for(auto& v:p)v/=s;return p;
}
int main(){Matrix a(2,2),b(2,1);a.values={1,2,3,4};b.values={5,6};auto c=matmul(a,b);near(c.at(0,0),17);near(c.at(1,0),39);
    bool fail=false;try{matmul(b,a);}catch(const std::invalid_argument&){fail=true;}require(fail,"accepted bad dimensions");
    auto p=softmax({1000,1001});near(p[0]+p[1],1);near(p[1],.73105857863);auto q=softmax({0,1});near(p[0],q[0]);
    std::cout<<"matmul=[17,39]; stable softmax=["<<p[0]<<","<<p[1]<<"]; mismatch rejected\n";
}
