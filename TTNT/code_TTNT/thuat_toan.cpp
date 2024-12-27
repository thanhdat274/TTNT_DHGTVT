#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <map>
#include <queue>
#include <stack>
#include <set>
#include <algorithm>

using namespace std;

// Hàm d?c d? th? t? file
map<string, vector<string> > readGraphFromFile(const string &fileName) {
    map<string, vector<string> > graph;
    ifstream file(fileName.c_str());
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

        // Lo?i b? kho?ng tr?ng t? cu?i c?a chu?i
        size_t lastPos = node.find_last_not_of(" ");
        if (lastPos != string::npos) {
            node = node.substr(0, lastPos + 1);
        } else {
            node = ""; // N?u không tìm th?y ký t? không ph?i kho?ng tr?ng, d?t node thành chu?i r?ng
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
                neighbor = ""; // N?u không tìm th?y, d?t neighbor thành chu?i r?ng
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


// Hàm ghi k?t qu? vào file
void writeToFile(const string &fileName, const vector<string> &path) {
    ofstream outFile(fileName.c_str()); // Dùng .c_str() n?u trình biên d?ch không h? tr? C++11
    if (outFile.is_open()) {
        outFile << "Path found: ";
        for (size_t i = 0; i < path.size(); ++i) {
            outFile << path[i] << " ";
        }
        outFile << endl;
        outFile.close();
    } else {
        cout << "Unable to open file: " << fileName << endl;
    }
}

// Thu?t toán BFS
void bfs(const map<string, vector<string> > &graph, const string &start, const string &goal, const string &outputFileName) {
    queue<string> q;
    set<string> visited;
    map<string, string> parent;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {
        string node = q.front();
        q.pop();

        if (node == goal) {
            // In ra du?ng di t? start d?n goal
            vector<string> path;
            string current = goal;

            while (current != "") {
                path.push_back(current);
                current = parent[current];
            }

            reverse(path.begin(), path.end());
            cout << "Path found by BFS: ";
            for (vector<string>::const_iterator it = path.begin(); it != path.end(); ++it) {
                cout << *it << " ";
            }
            cout << endl;

            // Ghi du?ng di vào file
            writeToFile(outputFileName, path);
            return;
        }

        for (vector<string>::const_iterator it = graph.at(node).begin(); it != graph.at(node).end(); ++it) {
            string neighbor = *it;
            if (visited.find(neighbor) == visited.end()) {
                q.push(neighbor);
                visited.insert(neighbor);
                parent[neighbor] = node;
            }
        }
    }

    cout << "No path found using BFS." << endl;
}

// Thu?t toán DFS
void dfs(const map<string, vector<string> > &graph, const string &start, const string &goal, const string &outputFileName) {
    stack<string> s;
    set<string> visited;
    map<string, string> parent;

    s.push(start);
    visited.insert(start);

    while (!s.empty()) {
        string node = s.top();
        s.pop();

        if (node == goal) {
            // In ra du?ng di t? start d?n goal
            vector<string> path;
            string current = goal;

            while (current != "") {
                path.push_back(current);
                current = parent[current];
            }

            reverse(path.begin(), path.end());
            cout << "Path found by DFS: ";
            for (vector<string>::const_iterator it = path.begin(); it != path.end(); ++it) {
                cout << *it << " ";
            }
            cout << endl;

            // Ghi du?ng di vào file
            writeToFile(outputFileName, path);
            return;
        }

        for (vector<string>::const_iterator it = graph.at(node).begin(); it != graph.at(node).end(); ++it) {
            string neighbor = *it;
            if (visited.find(neighbor) == visited.end()) {
                s.push(neighbor);
                visited.insert(neighbor);
                parent[neighbor] = node;
            }
        }
    }

    cout << "No path found using DFS." << endl;
}

int main() {
    // Ð?c d? th? t? file
    string fileName = "input.txt";
    map<string, vector<string> > graph = readGraphFromFile(fileName);

    // Th?c hi?n BFS và DFS
    string startNode = "A";
    string goalNode = "G";

    cout << "BFS Traversal:" << endl;
    bfs(graph, startNode, goalNode, "bfs_output.txt");

    cout << "\nDFS Traversal:" << endl;
    dfs(graph, startNode, goalNode, "dfs_output.txt");

    return 0;
}

