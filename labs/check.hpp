#pragma once
#include <cmath>
#include <stdexcept>
#include <string>
inline void require(bool condition, const std::string& message) {
    if (!condition) throw std::runtime_error(message);
}
inline void near(double actual, double expected, double tolerance=1e-6) {
    require(std::isfinite(actual) && std::abs(actual-expected)<=tolerance,
            "expected " + std::to_string(expected) + ", got " + std::to_string(actual));
}
