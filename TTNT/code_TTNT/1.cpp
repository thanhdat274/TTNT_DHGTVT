// DFS Algorithm
void dfs(const map<string, vector<string> >& graph, const string& start, const string& goal, const string& outputFileName) {
    stack<string> s;
    set<string> visited;
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
            for (vector<string>::const_iterator it = neighbors.begin(); it != neighbors.end(); ++it) {
                const string& neighbor = *it;
                if (uniqueL.find(neighbor) == uniqueL.end()) {
                    nextStates.push_back(neighbor);
                    if (find(Q.begin(), Q.end(), neighbor) == Q.end()) {
                        Q.push_back(neighbor);
                    }
                }
            }
            sort(nextStates.begin(), nextStates.end());

            for (vector<string>::const_iterator it = nextStates.begin(); it != nextStates.end(); ++it) {
                const string& neighbor = *it;
                if (uniqueL.find(neighbor) == uniqueL.end()) {
                    s.push(neighbor);
                    uniqueL.insert(neighbor);
                    L.push_back(neighbor);  // Update L list with newly discovered nodes
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
    
        resultEntry["LList"] = join(L, ",");  // Ensure LList reflects the current L
        result.push_back(resultEntry);

        if (currentState == goal) {
            break;
        }
    }

    writeToFile(outputFileName, result, "DFS");
}
