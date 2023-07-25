#!/bin/bash

session="react-starter-vite"

tmux new-session -d -s $session

# window=1
tmux rename-window -t $session:1 'vim'
tmux send-keys -t $session:1 'cd src; vim .' C-m

# window=2
tmux new-window -t $session:2  -n 'tools'
tmux split-window -h -t $session:2
tmux send-keys -t $session:2.1 'npm run start:local' C-m

# window=3
tmux new-window -t $session:3  -n 'readme'
tmux send-keys -t $session:3 'vim readme.md' C-m

# attach session
tmux attach-session -t $session

