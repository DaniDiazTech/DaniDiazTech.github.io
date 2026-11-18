#pragma once
#include <vector>
#include <cmath>
#include <stdexcept>
#include <cstddef>
struct Node {
    double value=0, grad=0;
    enum class Op {Leaf,Add,Mul,Tanh} op=Op::Leaf;
    std::size_t a=0,b=0;
};
class Tape {
public:
    std::vector<Node> nodes;
    std::size_t leaf(double x) { nodes.push_back({x,0,Node::Op::Leaf,0,0}); return nodes.size()-1; }
    std::size_t add(std::size_t a,std::size_t b) {
        nodes.push_back({nodes.at(a).value+nodes.at(b).value,0,Node::Op::Add,a,b}); return nodes.size()-1;
    }
    std::size_t mul(std::size_t a,std::size_t b) {
        nodes.push_back({nodes.at(a).value*nodes.at(b).value,0,Node::Op::Mul,a,b}); return nodes.size()-1;
    }
    std::size_t tanh(std::size_t a) {
        nodes.push_back({std::tanh(nodes.at(a).value),0,Node::Op::Tanh,a,0}); return nodes.size()-1;
    }
    void backward(std::size_t root) {
        nodes.at(root);
        for(auto& n:nodes) n.grad=0;
        // Operations are appended after their parents; indices are a topological order.
        nodes[root].grad=1;
        for(std::size_t end=root+1;end>0;--end) {
            const Node n=nodes[end-1];
            switch(n.op) {
            case Node::Op::Leaf: break;
            case Node::Op::Add: nodes[n.a].grad+=n.grad;nodes[n.b].grad+=n.grad;break;
            case Node::Op::Mul: nodes[n.a].grad+=n.grad*nodes[n.b].value;nodes[n.b].grad+=n.grad*nodes[n.a].value;break;
            case Node::Op::Tanh: nodes[n.a].grad+=n.grad*(1-n.value*n.value);break;
            }
        }
    }
};
