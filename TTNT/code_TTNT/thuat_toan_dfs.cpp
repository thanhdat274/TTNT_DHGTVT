#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <map>
#include <stack>      // For stack
#include <set>
#include <algorithm>
#include <string>
#include <iomanip>  // For setw

using namespace std;

// Function to join vector elements into a string with a delimiter
string join(const vector<string>& vec, const string& delimiter) {
    ostringstream oss;
    if (!vec.empty()) {
        vector<string>::const_iterator it = vec.begin();
        oss << *it;
        ++it;
        for (; it != vec.end(); ++it) {
            oss << delimiter << *it;
        }
    }
    return oss.str();
}

// Function to join map values into a string with a delimiter
string joinMapValues(const map<string, string>& m, const string& delimiter) {
    vector<string> values;
    for (map<string, string>::const_iterator it = m.begin(); it != m.end(); ++it) {
        values.push_back(it->second);
    }
    return join(values, delimiter);
}

// Function to read graph from file
map<string, vector<string> > readGraphFromFile(const string &fileName) {
    map<string, vector<string> > graph;
    ifstream file(fileName.c_str());  // Use c_str() for C++98 compatibility
    string line;

    if (!file.is_open()) {
        cout << "Unable to open file: " << fileName << endl;
        return graph;
    }

    while (getline(file, line)) {
        stringstream ss(line);
        string node;
        string neighbors;

        // Tách d?nh và các d?nh k?
        getline(ss, node, ':');
        getline(ss, neighbors);

        // Lo?i b? kho?ng tr?ng t? cu?i c?a chu?i node
        size_t lastPos = node.find_last_not_of(" ");
        if (lastPos != string::npos) {
            node = node.substr(0, lastPos + 1);
        } else {
            node = "";  // N?u không tìm th?y ký t? không ph?i kho?ng tr?ng, d?t node thành chu?i r?ng
        }

        stringstream neighborStream(neighbors);
        string neighbor;

        vector<string> adjacencyList;
        while (getline(neighborStream, neighbor, ',')) {
            // Lo?i b? kho?ng tr?ng ? d?u và cu?i c?a neighbor
            size_t start = neighbor.find_first_not_of(" ");
            size_t end = neighbor.find_last_not_of(" ");
            if (start != string::npos && end != string::npos && start <= end) {
                neighbor = neighbor.substr(start, end - start + 1);
            } else {
                neighbor = "";  // N?u không tìm th?y, d?t neighbor thành chu?i r?ng
            }

            if (!neighbor.empty()) {
                adjacencyList.push_back(neighbor);
            }
        }
        graph[node] = adjacencyList;
    }

    file.close();
    return graph;
}

// Function to write the result to file
void writeToFile(const string &fileName, const vector<map<string, string> >& result, const string &algorithm) {
    ofstream outFile(fileName.c_str());  // Use c_str() for C++98 compatibility
    if (outFile.is_open()) {
        outFile << "Algorithm: " << algorithm << endl;
        // Print the header
        outFile << left << setw(15) << "TT" << setw(40) << "KE" << setw(30) << "LList" << endl;
        outFile << string(115, '-') << endl;

        // Print the content
        for (vector<map<string, string> >::const_iterator it = result.begin(); it != result.end(); ++it) {
            const map<string, string> &entry = *it;
            outFile << left << setw(15) << entry.at("TT")
                    << setw(40) << entry.at("KE")
                    << setw(30) << entry.at("LList")
                    << endl;
        }

        outFile.close();
    } else {
        cout << "Unable to open file: " << fileName << endl;
    }
}

// DFS Algorithm
void dfs(const map<string, vector<string> >& graph, const string& start, const string& goal, const string& outputFileName) {
    stack<string> s;
    set<string> visited;
    map<string, string> parent;
    vector<map<string, string> > result;

    s.push(start);
    visited.insert(start);
    vector<string> L;
    vector<string> Q;
    Q.push_back(start);
    L.push_back(start);
    set<string> uniqueL;
    uniqueL.insert(start);

    while (!s.empty() && start != goal) {
        vector<string> nextStates;
        string currentState = s.top();
        s.pop();

        if (graph.find(currentState) != graph.end()) {
            const vector<string>& neighbors = graph.find(currentState)->second;
            for (size_t i = 0; i < neighbors.size(); ++i) {
                const string& neighbor = neighbors[i];
                nextStates.push_back(neighbor);
                if (find(Q.begin(), Q.end(), neighbor) == Q.end()) {
                    Q.push_back(neighbor);
                }
            }
            sort(nextStates.begin(), nextStates.end());

            for (size_t i = 0; i < nextStates.size(); ++i) {
                const string& neighbor = nextStates[i];
                if (uniqueL.find(neighbor) == uniqueL.end()) {
                    s.push(neighbor);
                    uniqueL.insert(neighbor);
                }
            }
        }

        // Convert the result to strings for writing
        map<string, string> resultEntry;
        resultEntry["TT"] = currentState;
        if (currentState != goal) {
            resultEntry["KE"] = (nextStates.empty() ? "" : join(nextStates, ","));
        } else {
            resultEntry["KE"] = "TTKT-Dung duong di la " + joinMapValues(result.back(), "<--");
        }
    
        resultEntry["LList"] = join(L, ",");
        result.push_back(resultEntry);

        if (currentState == goal) {
            break;
        }
    }

    writeToFile(outputFileName, result, "DFS");
}

int main() {
    string fileName = "input.txt";
    map<string, vector<string> > graph = readGraphFromFile(fileName);

    string startNode = "A";
    string goalNode = "G";

    cout << "DFS Traversal:" << endl;
    dfs(graph, startNode, goalNode, "dfs_output.txt");

    return 0;
}

