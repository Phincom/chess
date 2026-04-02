// ==================== CHESS GAME ENGINE ====================

class ChessGame {
    constructor() {
        this.board = [];
        this.currentTurn = 'white';
        this.selectedSquare = null;
        this.validMoves = [];
        this.gameActive = false;
        this.gameOver = false;
        this.winner = null;
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.isPlayerWhite = null;
        this.opponentId = null;
        this.lastMoveFrom = null;
        this.lastMoveTo = null;
        this.inCheck = false;
        this.castlingRights = {
            whiteKingSide: true,
            whiteQueenSide: true,
            blackKingSide: true,
            blackQueenSide: true
        };
        this.enPassantTarget = null;
        this.initializeBoard();
    }

    initializeBoard() {
        // 8x8 board with standard chess setup
        this.board = [
            [
                { piece: 'rook', color: 'black' },
                { piece: 'knight', color: 'black' },
                { piece: 'bishop', color: 'black' },
                { piece: 'queen', color: 'black' },
                { piece: 'king', color: 'black' },
                { piece: 'bishop', color: 'black' },
                { piece: 'knight', color: 'black' },
                { piece: 'rook', color: 'black' }
            ],
            [{ piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [{ piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }],
            [
                { piece: 'rook', color: 'white' },
                { piece: 'knight', color: 'white' },
                { piece: 'bishop', color: 'white' },
                { piece: 'queen', color: 'white' },
                { piece: 'king', color: 'white' },
                { piece: 'bishop', color: 'white' },
                { piece: 'knight', color: 'white' },
                { piece: 'rook', color: 'white' }
            ]
        ];
    }

    getPieceUnicode(piece, color) {
        const pieces = {
            white: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' },
            black: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' }
        };
        return pieces[color]?.[piece] || '';
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        let moves = [];
        const color = piece.color;

        switch (piece.piece) {
            case 'pawn':
                moves = this.getPawnMoves(row, col, color);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col, color);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col, color);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col, color);
                break;
            case 'queen':
                moves = this.getQueenMoves(row, col, color);
                break;
            case 'king':
                moves = this.getKingMoves(row, col, color);
                break;
        }

        // Filter moves - keep only legal moves that don't leave king in check
        const validMoves = moves.filter(([r, c]) => {
            if (!this.isValidPosition(r, c)) return false;
            
            // Simulate the move and check if king would be in check
            return this.isMoveLegal(row, col, r, c, color);
        });

        return validMoves;
    }

    isMoveLegal(fromRow, fromCol, toRow, toCol, color) {
        // Make a temporary copy of the board to test the move
        const originalBoard = this.board.map(row => [...row]);
        const originalCastling = JSON.parse(JSON.stringify(this.castlingRights));
        
        // Simulate the move
        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Update castling rights temporarily
        if (piece.piece === 'king') {
            if (color === 'white') {
                this.castlingRights.whiteKingSide = false;
                this.castlingRights.whiteQueenSide = false;
            } else {
                this.castlingRights.blackKingSide = false;
                this.castlingRights.blackQueenSide = false;
            }
        } else if (piece.piece === 'rook') {
            if (piece.color === 'white' && fromRow === 7) {
                if (fromCol === 0) this.castlingRights.whiteQueenSide = false;
                if (fromCol === 7) this.castlingRights.whiteKingSide = false;
            } else if (piece.color === 'black' && fromRow === 0) {
                if (fromCol === 0) this.castlingRights.blackQueenSide = false;
                if (fromCol === 7) this.castlingRights.blackKingSide = false;
            }
        }
        
        // Check if king would be in check after this move
        const kingInCheck = this.isKingInCheck(color);
        
        // Restore the board
        this.board = originalBoard;
        this.castlingRights = originalCastling;
        
        return !kingInCheck;
    }

    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        // Forward move
        const forwardRow = row + direction;
        if (this.isValidPosition(forwardRow, col) && !this.board[forwardRow][col]) {
            moves.push([forwardRow, col]);

            // Double move from start
            if (row === startRow) {
                const doubleRow = row + 2 * direction;
                if (!this.board[doubleRow][col]) {
                    moves.push([doubleRow, col]);
                }
            }
        }

        // Captures
        [-1, 1].forEach(colDelta => {
            const newCol = col + colDelta;
            const captureRow = row + direction;
            if (this.isValidPosition(captureRow, newCol)) {
                const target = this.board[captureRow][newCol];
                if (target && target.color !== color) {
                    moves.push([captureRow, newCol]);
                }
            }
        });

        return moves;
    }

    getRookMoves(row, col, color) {
        return this.getDirectionalMoves(row, col, color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    }

    getBishopMoves(row, col, color) {
        return this.getDirectionalMoves(row, col, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    }

    getQueenMoves(row, col, color) {
        return this.getDirectionalMoves(row, col, color, [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ]);
    }

    getDirectionalMoves(row, col, color, directions) {
        const moves = [];
        directions.forEach(([dRow, dCol]) => {
            let newRow = row + dRow;
            let newCol = col + dCol;
            while (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else {
                    if (target.color !== color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
                newRow += dRow;
                newCol += dCol;
            }
        });
        return moves;
    }

    getKnightMoves(row, col, color) {
        const moves = [];
        const positions = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        positions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== color) {
                    moves.push([newRow, newCol]);
                }
            }
        });
        return moves;
    }

    getKingMovesBasic(row, col, color) {
        // Basic king moves - 1 square in any direction (no castling)
        const moves = [];
        for (let dRow = -1; dRow <= 1; dRow++) {
            for (let dCol = -1; dCol <= 1; dCol++) {
                if (dRow === 0 && dCol === 0) continue;
                const newRow = row + dRow;
                const newCol = col + dCol;
                if (this.isValidPosition(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (!target || target.color !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            }
        }
        return moves;
    }

    getKingMoves(row, col, color) {
        const moves = this.getKingMovesBasic(row, col, color);
        
        // Castling moves
        if (color === 'white' && row === 7 && col === 4) {
            // Kingside castling (O-O)
            if (this.castlingRights.whiteKingSide &&
                !this.board[7][5] && !this.board[7][6] &&
                this.board[7][7] && this.board[7][7].piece === 'rook') {
                
                // Check if king is currently in check
                if (!this.isSquareUnderAttack(7, 4, 'white')) {
                    // Check if intermediate square is safe
                    if (!this.isSquareUnderAttack(7, 5, 'white')) {
                        moves.push([7, 6]);
                    }
                }
            }
            
            // Queenside castling (O-O-O)
            if (this.castlingRights.whiteQueenSide &&
                !this.board[7][3] && !this.board[7][2] && !this.board[7][1] &&
                this.board[7][0] && this.board[7][0].piece === 'rook') {
                
                if (!this.isSquareUnderAttack(7, 4, 'white')) {
                    if (!this.isSquareUnderAttack(7, 3, 'white')) {
                        moves.push([7, 2]);
                    }
                }
            }
        } else if (color === 'black' && row === 0 && col === 4) {
            // Black kingside castling
            if (this.castlingRights.blackKingSide &&
                !this.board[0][5] && !this.board[0][6] &&
                this.board[0][7] && this.board[0][7].piece === 'rook') {
                
                if (!this.isSquareUnderAttack(0, 4, 'black')) {
                    if (!this.isSquareUnderAttack(0, 5, 'black')) {
                        moves.push([0, 6]);
                    }
                }
            }
            
            // Black queenside castling
            if (this.castlingRights.blackQueenSide &&
                !this.board[0][3] && !this.board[0][2] && !this.board[0][1] &&
                this.board[0][0] && this.board[0][0].piece === 'rook') {
                
                if (!this.isSquareUnderAttack(0, 4, 'black')) {
                    if (!this.isSquareUnderAttack(0, 3, 'black')) {
                        moves.push([0, 2]);
                    }
                }
            }
        }
        
        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        // Check if it's a capture
        if (this.board[toRow][toCol]) {
            this.capturedPieces[piece.color].push(this.board[toRow][toCol]);
        }

        // Handle castling
        if (piece.piece === 'king' && Math.abs(toCol - fromCol) === 2) {
            // King moved 2 squares - it's a castle move
            if (toCol > fromCol) {
                // Kingside castle - move rook from right to middle
                const rook = this.board[fromRow][7];
                this.board[fromRow][5] = rook;
                this.board[fromRow][7] = null;
            } else {
                // Queenside castle - move rook from left to middle
                const rook = this.board[fromRow][0];
                this.board[fromRow][3] = rook;
                this.board[fromRow][0] = null;
            }
        }

        // Move the piece
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Handle pawn promotion
        if (piece.piece === 'pawn' && (toRow === 0 || toRow === 7)) {
            piece.piece = 'queen'; // Promote to queen by default
        }

        // Update castling rights
        if (piece.piece === 'king') {
            if (piece.color === 'white') {
                this.castlingRights.whiteKingSide = false;
                this.castlingRights.whiteQueenSide = false;
            } else {
                this.castlingRights.blackKingSide = false;
                this.castlingRights.blackQueenSide = false;
            }
        } else if (piece.piece === 'rook') {
            // Rook moved - update castling rights
            if (piece.color === 'white' && fromRow === 7) {
                if (fromCol === 0) this.castlingRights.whiteQueenSide = false;
                if (fromCol === 7) this.castlingRights.whiteKingSide = false;
            } else if (piece.color === 'black' && fromRow === 0) {
                if (fromCol === 0) this.castlingRights.blackQueenSide = false;
                if (fromCol === 7) this.castlingRights.blackKingSide = false;
            }
        }

        // Record move
        this.moveHistory.push({
            from: `${String.fromCharCode(65 + fromCol)}${8 - fromRow}`,
            to: `${String.fromCharCode(65 + toCol)}${8 - toRow}`,
            piece: piece.piece
        });

        this.lastMoveFrom = [fromRow, fromCol];
        this.lastMoveTo = [toRow, toCol];

        return true;
    }

    isGameOver() {
        const color = this.currentTurn;
        const validMoves = this.getAllValidMoves(color);
        return validMoves.length === 0;
    }

    isKingInCheck(color) {
        // Find king position
        let kingRow = -1, kingCol = -1;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.piece === 'king' && piece.color === color) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }

        if (kingRow === -1) return false;

        return this.isSquareUnderAttack(kingRow, kingCol, color);
    }

    // Check if a square is under attack by opponent (for castling and check detection)
    // Uses basic moves to avoid infinite recursion
    isSquareUnderAttack(row, col, defenderColor) {
        const opponent = defenderColor === 'white' ? 'black' : 'white';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === opponent) {
                    const moves = this.getBasicMoves(r, c, piece.piece);
                    if (moves.some(([mr, mc]) => mr === row && mc === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Get basic raw moves for a piece (no legal checks, just movement rules)
    getBasicMoves(row, col, pieceType) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        const color = piece.color;
        let moves = [];

        switch (pieceType) {
            case 'pawn':
                moves = this.getPawnMoves(row, col, color);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col, color);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col, color);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col, color);
                break;
            case 'queen':
                moves = this.getQueenMoves(row, col, color);
                break;
            case 'king':
                moves = this.getKingMovesBasic(row, col, color);
                break;
        }

        return moves.filter(([r, c]) => this.isValidPosition(r, c));
    }

    isCheckmate(color) {
        // Checkmate: King in check AND no legal moves available
        if (!this.isKingInCheck(color)) return false;
        const validMoves = this.getAllValidMoves(color);
        console.log(`♔ Checkmate check for ${color}: inCheck=true, validMoves=${validMoves.length}`);
        return validMoves.length === 0;
    }

    isStalemate(color) {
        // Stalemate: King NOT in check AND no legal moves available
        if (this.isKingInCheck(color)) return false;
        const validMoves = this.getAllValidMoves(color);
        console.log(`🤝 Stalemate check for ${color}: inCheck=false, validMoves=${validMoves.length}`);
        return validMoves.length === 0;
    }

    getAllValidMoves(color) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const pieceMoves = this.getValidMoves(row, col);
                    pieceMoves.forEach(([toRow, toCol]) => {
                        moves.push({ from: [row, col], to: [toRow, toCol] });
                    });
                    if (pieceMoves.length > 0) {
                        console.log(`  📍 ${piece.piece.toUpperCase()} at [${row},${col}]: ${pieceMoves.length} legal moves`);
                    }
                }
            }
        }
        console.log(`📋 Total legal moves for ${color}: ${moves.length}`);
        return moves;
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    }
}

// ==================== FIREBASE MANAGEMENT ====================

let currentUser = null;
let gameRoom = null;
let game = null;
let currentGameId = null;
let onlinePlayers = {};
let onlinePlayersListener = null;
let challengeListener = null;
let incomingChallenges = {};
let playerRating = 1200;

// Timer variables
let timeControl = 600; // default 10 minutes
let whiteTimeRemaining = timeControl;
let blackTimeRemaining = timeControl;
let timerInterval = null;
let gameStarted = false;

// Ping variables
let pingInterval = null;
let currentPing = 0;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    if (!game || !gameStarted) return;
    
    timerInterval = setInterval(() => {
        if (game.currentTurn === 'white') {
            whiteTimeRemaining--;
        } else {
            blackTimeRemaining--;
        }
        
        // Check for time out
        if ((game.currentTurn === 'white' && whiteTimeRemaining <= 0) ||
            (game.currentTurn === 'black' && blackTimeRemaining <= 0)) {
            endGameOnTimeout();
        }
        
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const playerTimerEl = document.getElementById('playerTimer');
    const opponentTimerEl = document.getElementById('opponentTimer');
    
    let playerTime, opponentTime;
    if (game.isPlayerWhite) {
        playerTime = whiteTimeRemaining;
        opponentTime = blackTimeRemaining;
    } else {
        playerTime = blackTimeRemaining;
        opponentTime = whiteTimeRemaining;
    }
    
    playerTimerEl.textContent = formatTime(playerTime);
    opponentTimerEl.textContent = formatTime(opponentTime);
    
    // Add warning colors for low time
    playerTimerEl.style.color = playerTime < 30 ? '#ff1100' : (playerTime < 60 ? '#ff9800' : 'inherit');
    opponentTimerEl.style.color = opponentTime < 30 ? '#ff1100' : (opponentTime < 60 ? '#ff9800' : 'inherit');
    
    // Add pulse animation to current player's timer
    if (gameStarted && !game.gameOver) {
        if ((game.isPlayerWhite && game.currentTurn === 'white') ||
            (!game.isPlayerWhite && game.currentTurn === 'black')) {
            playerTimerEl.classList.add('running');
            opponentTimerEl.classList.remove('running');
        } else {
            opponentTimerEl.classList.add('running');
            playerTimerEl.classList.remove('running');
        }
    }
}

// ==================== PING MEASUREMENT ====================

function measurePing() {
    const startTime = Date.now();
    
    // Write a ping marker to Firebase at current timestamp
    db.ref(`ping_test/${currentUser.uid}_${startTime}`).set(true)
        .then(() => {
            // Calculate round-trip time
            const endTime = Date.now();
            currentPing = endTime - startTime;
            updatePingDisplay();
        })
        .catch(err => {
            console.log('Ping measurement skipped:', err.message);
        });
}

function updatePingDisplay() {
    const pingEl = document.getElementById('pingDisplay');
    if (!pingEl) return;
    
    if (!gameStarted) {
        pingEl.textContent = `🌐 Ping: -- ms`;
        pingEl.className = 'ping-display';
        return;
    }
    
    let pingClass = 'good';
    if (currentPing > 200) {
        pingClass = 'poor';
    } else if (currentPing > 100) {
        pingClass = 'moderate';
    }
    
    pingEl.textContent = `🌐 Ping: ${currentPing} ms`;
    pingEl.className = `ping-display ${pingClass}`;
}

function startPingMonitoring() {
    console.log('🌐 Starting ping monitoring...');
    // Measure ping every 3 seconds during gameplay
    if (pingInterval) clearInterval(pingInterval);
    measurePing(); // Immediate first ping
    pingInterval = setInterval(measurePing, 3000);
}

function stopPingMonitoring() {
    console.log('🌐 Stopping ping monitoring');
    if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
    }
}

function endGameOnTimeout() {
    const loser = game.currentTurn;
    const winner = loser === 'white' ? 'Black' : 'White';
    
    game.gameOver = true;
    game.winner = winner;
    stopTimer();
    
    firebase.database().ref(`games/${currentGameId}`).update({
        gameOver: true,
        winner: winner,
        status: 'finished',
        endReason: 'timeout'
    });
}

function setupAuthListener() {
    // Setup auth form listeners on page load
    console.log('🔧 Setting up auth listeners...');
    setupAuthFormListeners();
    console.log('✓ Auth form listeners attached');
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('🔐 User authenticated:', user.email, '| UID:', user.uid);
            currentUser = user;
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('gameSection').classList.remove('hidden');
            document.getElementById('playerName').textContent = user.email || 'Player';
            document.getElementById('playerRating').textContent = `Rating: ${playerRating}`;
            
            // Setup lobby
            console.log('🚀 Setting up lobby...');
            registerPlayerOnline(user.uid, user.email);
            setupLobby();
            loadOnlinePlayers();
            listenForChallenges();
            
            setupGameListeners();
        } else {
            console.log('🔓 User logged out');
            currentUser = null;
            document.getElementById('authSection').classList.remove('hidden');
            document.getElementById('gameSection').classList.add('hidden');
            if (currentGameId) {
                removeGameListener();
            }
        }
    });
}

// ==================== EMAIL VALIDATION ====================

function isValidEmail(email) {
    // RFC 5322 simplified regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0 && email.length <= 254;
}

function setupAuthFormListeners() {
    console.log('🔗 Attaching auth form listeners...');
    const loginBtn = document.getElementById('loginSubmitBtn');
    const registerBtn = document.getElementById('registerSubmitBtn');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    
    console.log('📍 Elements found:', {
        loginBtn: !!loginBtn,
        registerBtn: !!registerBtn,
        showRegisterLink: !!showRegisterLink,
        showLoginLink: !!showLoginLink
    });
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        console.log('✓ Login button listener attached');
    } else {
        console.error('❌ Login button not found!');
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
        console.log('✓ Register button listener attached');
    } else {
        console.error('❌ Register button not found!');
    }
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
            console.log('✓ Switched to register form');
        });
        console.log('✓ Show register link listener attached');
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            console.log('✓ Switched to login form');
        });
        console.log('✓ Show login link listener attached');
    }
}

function setupGameListeners() {
    console.log('🎮 Setting up game listeners...');
    
    const logoutBtn = document.getElementById('logoutBtn');
    const createRoomBtn = document.getElementById('createRoomBtn');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const resignBtn = document.getElementById('resignBtn');
    const drawBtn = document.getElementById('drawBtn');
    const rematchBtn = document.getElementById('rematchBtn');
    const askMatchBtn = document.getElementById('askMatchBtn');
    
    console.log('📍 Game buttons found:', {
        logoutBtn: !!logoutBtn,
        createRoomBtn: !!createRoomBtn,
        joinRoomBtn: !!joinRoomBtn,
        resignBtn: !!resignBtn,
        drawBtn: !!drawBtn,
        rematchBtn: !!rematchBtn,
        askMatchBtn: !!askMatchBtn
    });
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut();
        });
        console.log('✓ Logout listener attached');
    }
    
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', createNewGame);
        console.log('✓ Create Room listener attached');
    } else {
        console.error('❌ createRoomBtn not found!');
    }
    
    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', joinGame);
        console.log('✓ Join Room listener attached');
    } else {
        console.error('❌ joinRoomBtn not found!');
    }
    
    if (resignBtn) resignBtn.addEventListener('click', resignGame);
    if (drawBtn) drawBtn.addEventListener('click', offerDraw);
    if (rematchBtn) rematchBtn.addEventListener('click', offerRematch);
    if (askMatchBtn) askMatchBtn.addEventListener('click', askForRematch);
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');
    
    console.log('🔑 Login attempt:', { email, passwordLength: password?.length });
    
    if (!email || !password) {
        console.log('❌ Login validation failed - missing fields');
        errorElement.textContent = 'Please fill in all fields';
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        console.log('❌ Login validation failed - invalid email format');
        errorElement.textContent = 'Please enter a valid email address';
        return;
    }

    if (!firebase.auth) {
        console.error('❌ Firebase auth not available!');
        errorElement.textContent = 'Firebase not initialized';
        return;
    }

    console.log('📤 Calling signInWithEmailAndPassword...');
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            console.log('✓ Login successful:', result.user.email);
            errorElement.textContent = '';
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        })
        .catch(error => {
            console.error('❌ Login error:', error.code, error.message);
            errorElement.textContent = error.message || 'Login failed';
        });
}

function handleRegister() {
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const username = document.getElementById('registerUsername').value.trim();
    const errorElement = document.getElementById('registerError');
    
    console.log('📝 Register attempt:', { email, username, passwordLength: password?.length });
    
    if (!email || !password || !username) {
        console.log('❌ Register validation failed - missing fields');
        errorElement.textContent = 'Please fill in all fields';
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        console.log('❌ Register validation failed - invalid email format');
        errorElement.textContent = 'Please enter a valid email address';
        return;
    }

    if (password.length < 6) {
        console.log('❌ Register validation failed - password too short');
        errorElement.textContent = 'Password must be at least 6 characters';
        return;
    }

    if (username.length < 2) {
        console.log('❌ Register validation failed - username too short');
        errorElement.textContent = 'Username must be at least 2 characters';
        return;
    }

    if (!firebase.auth) {
        console.error('❌ Firebase auth not available!');
        errorElement.textContent = 'Firebase not initialized';
        return;
    }

    console.log('📤 Calling createUserWithEmailAndPassword...');
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            console.log('✓ User created, updating profile...');
            // Update profile with username
            return result.user.updateProfile({
                displayName: username
            }).then(() => {
                console.log('✓ Account created successfully:', email);
                errorElement.textContent = '';
                document.getElementById('registerEmail').value = '';
                document.getElementById('registerPassword').value = '';
                document.getElementById('registerUsername').value = '';
                // Show success and switch to login
                alert('Account created! Please sign in.');
                document.getElementById('registerForm').classList.add('hidden');
                document.getElementById('loginForm').classList.remove('hidden');
            });
        })
        .catch(error => {
            console.error('❌ Registration error:', error.code, error.message);
            errorElement.textContent = error.message || 'Registration failed';
        });
}


function generateRoomId() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}

function createNewGame() {
    const roomId = generateRoomId();
    currentGameId = roomId;
    game = new ChessGame();
    
    // Get time control selection
    const timeSelect = document.getElementById('timeControlSelect');
    if (timeSelect && timeSelect.value !== 'unlimited') {
        timeControl = parseInt(timeSelect.value);
    } else {
        timeControl = 0; // unlimited
    }
    
    whiteTimeRemaining = timeControl;
    blackTimeRemaining = timeControl;

    const gameData = {
        createdBy: currentUser.uid,
        createdAt: Date.now(),
        player1: {
            id: currentUser.uid,
            name: currentUser.email,
            rating: 1200,
            color: 'white'
        },
        player2: null,
        board: JSON.stringify(game.board),
        currentTurn: 'white',
        moveHistory: [],
        status: 'waiting',
        gameOver: false,
        winner: null,
        timeControl: timeControl,
        whiteTime: whiteTimeRemaining,
        blackTime: blackTimeRemaining
    };

    firebase.database().ref(`games/${roomId}`).set(gameData)
        .then(() => {
            game.isPlayerWhite = true;
            document.getElementById('roomId').textContent = roomId;
            document.getElementById('colorDisplay').textContent = 'White';
            document.getElementById('playerNameBottom').textContent = currentUser.email;
            document.getElementById('statusIndicator').textContent = 'Waiting for opponent...';
            document.getElementById('statusIndicator').className = 'status-indicator status-waiting';
            
            listenToGameUpdates(roomId);
            renderBoard();
            loadGameUI();
            updateTimerDisplay();
        })
        .catch(error => console.error('Error creating game:', error));
}

function joinGame() {
    const roomId = document.getElementById('joinRoomInput').value.toUpperCase().trim();
    if (!roomId) {
        alert('Please enter a room ID');
        return;
    }

    firebase.database().ref(`games/${roomId}`).once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                alert('Room not found');
                return;
            }

            const gameData = snapshot.val();
            if (gameData.player2) {
                alert('Room is full');
                return;
            }

            currentGameId = roomId;
            game = new ChessGame();
            
            // Get time control from existing game
            timeControl = gameData.timeControl || 600;
            whiteTimeRemaining = gameData.whiteTime || timeControl;
            blackTimeRemaining = gameData.blackTime || timeControl;

            // Update game with second player
            const updates = {};
            updates[`games/${roomId}/player2`] = {
                id: currentUser.uid,
                name: currentUser.email,
                rating: 1200,
                color: 'black'
            };
            updates[`games/${roomId}/status`] = 'playing';
            updates[`games/${roomId}/startTime`] = Date.now();

            firebase.database().ref().update(updates)
                .then(() => {
                    game.isPlayerWhite = false;
                    document.getElementById('roomId').textContent = roomId;
                    document.getElementById('colorDisplay').textContent = 'Black';
                    document.getElementById('playerNameBottom').textContent = currentUser.email;
                    document.getElementById('statusIndicator').textContent = 'Game Started';
                    document.getElementById('statusIndicator').className = 'status-indicator status-playing';
                    document.getElementById('joinRoomInput').value = '';
                    
                    listenToGameUpdates(roomId);
                    renderBoard();
                    loadGameUI();
                    updateTimerDisplay();
                    gameStarted = true;
                    startTimer();
                })
                .catch(error => console.error('Error joining game:', error));
        })
        .catch(error => console.error('Error fetching game:', error));
}

function listenToGameUpdates(roomId) {
    // Start listening to chat for this game
    currentGameId = roomId;
    listenToChat();
    
    firebase.database().ref(`games/${roomId}`).on('value', snapshot => {
        if (snapshot.exists()) {
            const gameData = snapshot.val();
            
            if (gameData.board) {
                game.board = JSON.parse(gameData.board);
            }
            
            game.currentTurn = gameData.currentTurn;
            game.moveHistory = gameData.moveHistory || [];
            game.gameOver = gameData.gameOver || false;
            game.winner = gameData.winner;
            
            // Update timers
            whiteTimeRemaining = gameData.whiteTime || whiteTimeRemaining;
            blackTimeRemaining = gameData.blackTime || blackTimeRemaining;

            // Update opponent display
            if (gameData.player2) {
                document.getElementById('opponentNameTop').textContent = gameData.player2.name;
                document.getElementById('opponentRatingTop').textContent = gameData.player2.rating || '1200';
                
                // Start game if not already started
                if (gameData.status === 'playing' && !gameStarted) {
                    gameStarted = true;
                    startTimer();
                    startPingMonitoring();
                }
            } else {
                document.getElementById('opponentNameTop').textContent = 'Waiting...';
                document.getElementById('opponentRatingTop').textContent = '-';
            }

            updateGameStatus();
            updateTimerDisplay();
            renderBoard();
            updateUI();

            if (gameData.gameOver) {
                stopTimer();
                stopPingMonitoring();
                showGameOverModal(gameData.winner);
                game.gameActive = false;
            } else {
                game.gameActive = true;
            }
        }
    });
}

function removeGameListener() {
    if (currentGameId) {
        firebase.database().ref(`games/${currentGameId}`).off();
    }
}

function updateGameOnFirebase() {
    if (!currentGameId || !game) return;

    const gameUpdate = {
        board: JSON.stringify(game.board),
        currentTurn: game.currentTurn,
        moveHistory: game.moveHistory,
        capturedPieces: game.capturedPieces,
        whiteTime: whiteTimeRemaining,
        blackTime: blackTimeRemaining
    };

    firebase.database().ref(`games/${currentGameId}`).update(gameUpdate)
        .catch(error => console.error('Error updating game:', error));
}

// ==================== UI FUNCTIONS ====================

function renderBoard() {
    if (!game) return;

    const board = document.getElementById('chessboard');
    board.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            square.className = `square ${isLight ? 'light' : 'dark'}`;

            // Highlight last move
            if (game.lastMoveFrom && game.lastMoveTo) {
                if ((row === game.lastMoveFrom[0] && col === game.lastMoveFrom[1]) ||
                    (row === game.lastMoveTo[0] && col === game.lastMoveTo[1])) {
                    square.style.backgroundColor = 'rgba(255, 192, 0, 0.5)';
                }
            }

            // Highlight selected square
            if (game.selectedSquare && row === game.selectedSquare[0] && col === game.selectedSquare[1]) {
                square.classList.add('selected');
            }

            // Highlight valid moves
            if (game.validMoves.some(([r, c]) => r === row && c === col)) {
                square.classList.add('valid-move');
            }

            const piece = game.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.textContent = game.getPieceUnicode(piece.piece, piece.color);
                pieceElement.className = 'piece';
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            board.appendChild(square);
        }
    }

    updateGameStatus();
}

function updateGameStatus() {
    if (!game || !currentGameId) return;

    const gameInfoEl = document.querySelector('.game-info');
    if (!gameInfoEl) return;

    let statusText = `${game.currentTurn.toUpperCase()}'s Turn`;
    let statusClass = '';

    // Debug: Check what moves are available
    const availableMoves = game.getAllValidMoves(game.currentTurn);
    const inCheck = game.isKingInCheck(game.currentTurn);
    console.log(`🔍 Game state for ${game.currentTurn}: inCheck=${inCheck}, legalMoves=${availableMoves.length}`);

    // Check for checkmate
    if (inCheck && availableMoves.length === 0) {
        const winner = game.currentTurn === 'white' ? 'Black' : 'White';
        statusText = `♔ CHECKMATE! ${winner} wins! ♔`;
        statusClass = 'checkmate';
        game.winner = winner;
        game.gameOver = true;
        console.log('✅ CHECKMATE DETECTED!');
    }
    // Check for stalemate
    else if (!inCheck && availableMoves.length === 0) {
        statusText = '🤝 STALEMATE! Game is a Draw! 🤝';
        statusClass = 'stalemate';
        game.gameOver = true;
        console.log('✅ STALEMATE DETECTED!');
    }
    // Check for check
    else if (inCheck) {
        statusText = `⚠️ ${game.currentTurn.toUpperCase()} is in CHECK! ⚠️`;
        statusClass = 'check';
        console.log('⚠️ CHECK DETECTED!');
    }

    const statusEl = gameInfoEl.querySelector('.status-text');
    if (statusEl) {
        statusEl.textContent = statusText;
        statusEl.className = `status-text ${statusClass}`;
    }

    console.log('📊 Game Status:', statusText);
}

function handleSquareClick(row, col) {
    if (!game || !game.gameActive) return;
    
    // Only allow moves if it's player's turn and they're playing
    const isPlayerTurn = (game.isPlayerWhite && game.currentTurn === 'white') ||
                         (!game.isPlayerWhite && game.currentTurn === 'black');
    
    if (!isPlayerTurn) {
        alert('Not your turn!');
        return;
    }

    const piece = game.board[row][col];

    if (game.selectedSquare) {
        // Check if clicking a valid move
        if (game.validMoves.some(([r, c]) => r === row && c === col)) {
            // Make the move
            const [fromRow, fromCol] = game.selectedSquare;
            game.makeMove(fromRow, fromCol, row, col);
            game.switchTurn();
            playSound('move');
            
            // Check for check/checkmate
            if (game.isCheckmate(game.currentTurn)) {
                playSound('checkmate');
                const winner = game.currentTurn === 'white' ? 'Black' : 'White';
                game.winner = winner;
                game.gameOver = true;
            } else if (game.isKingInCheck(game.currentTurn)) {
                playSound('check');
            }
            
            updateGameOnFirebase();
            game.selectedSquare = null;
            game.validMoves = [];
            renderBoard();
            updateUI();
        }
        // Click on another piece of the same color
        else if (piece && piece.color === game.board[game.selectedSquare[0]][game.selectedSquare[1]].color) {
            game.selectedSquare = [row, col];
            game.validMoves = game.getValidMoves(row, col);
            renderBoard();
        }
        // Click empty or invalid
        else {
            game.selectedSquare = null;
            game.validMoves = [];
            renderBoard();
        }
    } else {
        // Select a piece of the current player's color
        if (piece && ((game.isPlayerWhite && piece.color === 'white') ||
                      (!game.isPlayerWhite && piece.color === 'black'))) {
            game.selectedSquare = [row, col];
            game.validMoves = game.getValidMoves(row, col);
            renderBoard();
        }
    }
}

function updateGameStatus() {
    const statusElement = document.getElementById('gameStatus');
    
    if (game.gameOver) {
        statusElement.textContent = `${game.winner} wins!`;
    } else {
        const turnText = game.currentTurn === 'white' ? 'White' : 'Black';
        statusElement.textContent = `${turnText}'s turn`;
    }
}

function updateUI() {
    // Update move count
    document.getElementById('moveCount').textContent = `Moves: ${game.moveHistory.length}`;

    // Update move history
    const movesListElement = document.getElementById('movesList');
    movesListElement.innerHTML = '';
    game.moveHistory.forEach((move, index) => {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        moveItem.textContent = `${index + 1}. ${move.from} → ${move.to} (${move.piece})`;
        movesListElement.appendChild(moveItem);
    });

    // Scroll to bottom
    movesListElement.scrollTop = movesListElement.scrollHeight;

    updateGameStatus();
}

function loadGameUI() {
    document.getElementById('resignBtn').classList.remove('hidden');
    document.getElementById('drawBtn').classList.remove('hidden');
    renderBoard();
    updateUI();
}

function resignGame() {
    if (!currentGameId) return;
    
    const loser = game.isPlayerWhite ? 'White' : 'Black';
    const winner = game.isPlayerWhite ? 'Black' : 'White';
    
    firebase.database().ref(`games/${currentGameId}`).update({
        gameOver: true,
        winner: winner,
        status: 'finished'
    });
    
    game.gameOver = true;
    game.winner = winner;
    game.gameActive = false;
}

function offerDraw() {
    if (!currentGameId) return;
    alert('Draw offer sent! Waiting for opponent...');
    firebase.database().ref(`games/${currentGameId}`).update({
        drawOffered: true,
        drawOfferedBy: game.isPlayerWhite ? 'white' : 'black'
    });
}

function askForRematch() {
    if (!currentGameId) return;
    alert('Rematch requested!');
    firebase.database().ref(`games/${currentGameId}`).update({
        rematchRequested: true,
        rematchRequestedBy: game.isPlayerWhite ? 'white' : 'black'
    });
}

function offerRematch() {
    // Create new game with same opponent
    const newRoomId = generateRoomId();
    const newGame = new ChessGame();
    
    // Swap colors
    const newPlayerColor = game.isPlayerWhite ? 'black' : 'white';
    
    const gameData = {
        createdBy: currentUser.uid,
        createdAt: Date.now(),
        player1: {
            id: currentUser.uid,
            name: currentUser.email,
            rating: 1200,
            color: newPlayerColor
        },
        player2: null,
        board: JSON.stringify(newGame.board),
        currentTurn: 'white',
        moveHistory: [],
        status: 'waiting',
        gameOver: false,
        winner: null,
        timeControl: timeControl,
        whiteTime: timeControl,
        blackTime: timeControl,
        previousGameId: currentGameId
    };
    
    firebase.database().ref(`games/${newRoomId}`).set(gameData)
        .then(() => {
            stopTimer();
            removeGameListener();
            currentGameId = newRoomId;
            game = newGame;
            game.isPlayerWhite = newPlayerColor === 'white';
            
            document.getElementById('roomId').textContent = newRoomId;
            document.getElementById('gameStatus').textContent = 'Rematch created! Waiting for opponent...';
            
            listenToGameUpdates(newRoomId);
            renderBoard();
            updateTimerDisplay();
        })
        .catch(error => console.error('Error creating rematch:', error));
}

function showGameOverModal(winner) {
    const modal = document.getElementById('gameOverModal');
    const titleElement = document.getElementById('gameOverTitle');
    const messageElement = document.getElementById('gameOverMessage');

    // Calculate and update ELO ratings
    if (winner && game && currentUser) {
        const playerWon = (game.isPlayerWhite && winner === 'White') || (!game.isPlayerWhite && winner === 'Black');
        
        // Get opponent's rating from database
        firebase.database().ref('players').once('value', snapshot => {
            snapshot.forEach(playerSnapshot => {
                const player = playerSnapshot.val();
                if (player.id !== currentUser.uid) {
                    // Calculate ELO changes
                    const { winnerChange, loserChange } = calculateEloChange(
                        playerWon ? playerRating : player.rating,
                        playerWon ? player.rating : playerRating,
                        true
                    );
                    
                    if (playerWon) {
                        playerRating += winnerChange;
                        updatePlayerRating(currentUser.uid, winnerChange);
                        updatePlayerRating(player.id, loserChange);
                    } else {
                        playerRating += loserChange;
                        updatePlayerRating(currentUser.uid, loserChange);
                        updatePlayerRating(player.id, winnerChange);
                    }
                    
                    console.log(`📊 ELO Update: ${playerWon ? '+' : ''}${playerWon ? winnerChange : loserChange}`);
                    document.getElementById('playerRating').textContent = `Rating: ${playerRating}`;
                }
            });
        });
        
        // Save game to history
        saveGameToHistory({
            players: [currentUser.uid],
            winner: winner,
            status: 'finished',
            createdAt: Date.now(),
            moveCount: game.moveHistory.length
        });
    }

    if (game.isPlayerWhite && winner === 'White') {
        titleElement.textContent = '🎉 You Won! 🎉';
        messageElement.textContent = `Congratulations! +${playerRating - 1200} ELO`;
    } else if (!game.isPlayerWhite && winner === 'Black') {
        titleElement.textContent = '🎉 You Won! 🎉';
        messageElement.textContent = `Congratulations! +${playerRating - 1200} ELO`;
    } else {
        titleElement.textContent = '😢 You Lost';
        messageElement.textContent = `${winner} won the game.`;
    }

    // Show rematch button
    document.getElementById('rematchBtn').classList.remove('hidden');
    document.getElementById('askMatchBtn').classList.remove('hidden');
    document.getElementById('resignBtn').classList.add('hidden');
    
    modal.classList.remove('hidden');
    document.getElementById('backToDashboard').addEventListener('click', () => {
        location.reload();
    });
}

// ==================== LOBBY FUNCTIONS ====================

function setupLobby() {
    console.log('🏛️ Setting up lobby...');
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log(`📑 Found ${tabBtns.length} tab buttons`);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            console.log(`📑 Switching to tab: ${tabName}`);
            
            // Remove active from all tabs
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            
            // Add active to clicked tab
            btn.classList.add('active');
            const tabId = tabName + 'Tab';
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add('active');
                console.log(`✓ Activated tab: ${tabId}`);
            } else {
                console.error(`❌ Tab element not found: ${tabId}`);
            }
            
            // Load data for specific tabs
            if (tabName === 'lobby') {
                console.log('🔄 Reloading players for lobby tab...');
                loadOnlinePlayers();
            } else if (tabName === 'leaderboard') {
                console.log('🏆 Loading leaderboard...');
                loadLeaderboard();
            } else if (tabName === 'history') {
                console.log('📊 Loading game history...');
                loadGameHistory();
            }
        });
    });
    
    // Load initial data
    console.log('📥 Loading initial lobby data...');
    loadLeaderboard();
    loadGameHistory();
    loadOnlinePlayers(); // This is important - load players initially!
}

function registerPlayerOnline(userId, email) {
    const playerData = {
        id: userId,
        name: email,
        rating: playerRating,
        status: 'available',
        lastSeen: Date.now()
    };
    
    console.log('📍 Registering player online:', playerData);
    firebase.database().ref(`players/${userId}`).set(playerData).then(() => {
        console.log('✅ Player successfully registered in Firebase');
    }).catch(err => {
        console.error('❌ Error registering player:', err);
    });
    
    // Remove player when they disconnect
    firebase.database().ref(`players/${userId}`).onDisconnect().remove();
}

function loadOnlinePlayers() {
    // Remove existing listener if any
    if (onlinePlayersListener) {
        firebase.database().ref('players').off('value', onlinePlayersListener);
    }
    
    console.log('🔔 loadOnlinePlayers() called');
    
    onlinePlayersListener = function(snapshot) {
        onlinePlayers = {};
        const playersList = [];
        
        console.log('📊 Loading players from Firebase...');
        console.log('👤 Current user ID:', currentUser?.uid);
        console.log('📦 Raw snapshot:', snapshot.val());
        
        if (!snapshot.exists()) {
            console.warn('⚠️ No players in database at all');
            displayPlayersList([]);
            return;
        }
        
        snapshot.forEach(playerSnapshot => {
            const playerData = playerSnapshot.val();
            console.log('Found player in DB:', playerData);
            if (playerData && playerData.id && currentUser && playerData.id !== currentUser.uid) { // Don't show yourself
                onlinePlayers[playerData.id] = playerData;
                playersList.push(playerData);
                console.log('✅ Added to display list:', playerData.name);
            } else if (playerData && playerData.id === currentUser?.uid) {
                console.log('⏭️ Skipped current user:', playerData.name);
            }
        });
        
        console.log(`📋 Total players to display: ${playersList.length}`);
        displayPlayersList(playersList);
    };
    
    firebase.database().ref('players').on('value', onlinePlayersListener, err => {
        console.error('❌ Error loading players:', err);
    });
}

function displayPlayersList(players) {
    const playersList = document.getElementById('playersList');
    
    console.log('🎨 Rendering players list with', players.length, 'players');
    
    if (players.length === 0) {
        playersList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">No online players</p>';
        console.log('⚠️ No players to display');
        return;
    }
    
    playersList.innerHTML = players.map(player => `
        <div class="player-row">
            <div class="col-name">${player.name}</div>
            <div class="col-rating">${player.rating}</div>
            <div class="col-status">
                <span class="status-online"></span>${player.status === 'available' ? 'Available' : 'In Game'}
            </div>
            <div class="col-actions">
                <button class="btn btn-xs btn-primary" onclick="askForMatch('${player.id}', '${player.name}')">Ask</button>
                <button class="btn btn-xs btn-secondary" onclick="viewProfile('${player.id}')">Profile</button>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Players list rendered successfully');
}

function askForMatch(opponentId, opponentName) {
    if (confirm(`Ask ${opponentName} for a match?`)) {
        const roomId = generateRoomId();
        
        console.log('📤 Sending challenge to:', opponentName, 'Room:', roomId);
        
        // Create a challenge notification
        firebase.database().ref(`challenges/${opponentId}/${roomId}`).set({
            from: currentUser.uid,
            fromName: currentUser.email,
            fromRating: playerRating,
            createdAt: Date.now(),
            accepted: false
        }).then(() => {
            alert(`Challenge sent to ${opponentName}! Waiting for response...`);
        }).catch(err => {
            console.error('Error sending challenge:', err);
            alert('Failed to send challenge. Check console.');
        });
    }
}

function viewProfile(playerId) {
    const player = onlinePlayers[playerId];
    if (player) {
        alert(`Player: ${player.name}\nRating: ${player.rating}\nStatus: ${player.status}`);
    }
}

function listenForChallenges() {
    if (challengeListener) {
        firebase.database().ref(`challenges/${currentUser.uid}`).off('value', challengeListener);
    }
    
    challengeListener = function(snapshot) {
        incomingChallenges = {};
        const challengesList = [];
        
        console.log('🔔 Checking for match requests...');
        
        if (!snapshot.exists()) {
            console.log('✅ No incoming challenges');
            displayChallengesNotifications([]);
            return;
        }
        
        snapshot.forEach(challengeSnapshot => {
            const challengeData = challengeSnapshot.val();
            const roomId = challengeSnapshot.key;
            
            if (challengeData && !challengeData.accepted) {
                incomingChallenges[roomId] = challengeData;
                challengesList.push({
                    roomId: roomId,
                    from: challengeData.from,
                    fromName: challengeData.fromName,
                    fromRating: challengeData.fromRating,
                    createdAt: challengeData.createdAt
                });
                console.log('📬 Incoming challenge from:', challengeData.fromName);
            }
        });
        
        console.log(`📋 Total challenges: ${challengesList.length}`);
        displayChallengesNotifications(challengesList);
    };
    
    firebase.database().ref(`challenges/${currentUser.uid}`).on('value', challengeListener, err => {
        console.error('❌ Error listening for challenges:', err);
    });
}

function displayChallengesNotifications(challenges) {
    const notificationsList = document.getElementById('notificationsList');
    
    if (!notificationsList) return;
    
    if (challenges.length === 0) {
        notificationsList.innerHTML = '<p class="no-notifications">No match requests</p>';
        return;
    }
    
    notificationsList.innerHTML = challenges.map(challenge => `
        <div class="notification-item">
            <div class="notification-info">
                <div class="notification-from">⚔️ ${challenge.fromName}</div>
                <div class="notification-rating">Rating: ${challenge.fromRating}</div>
            </div>
            <div class="notification-actions">
                <button class="btn-accept" onclick="acceptChallenge('${challenge.roomId}', '${challenge.from}')">Accept</button>
                <button class="btn-decline" onclick="declineChallenge('${challenge.roomId}')">Decline</button>
            </div>
        </div>
    `).join('');
}

function acceptChallenge(roomId, opponentId) {
    console.log('✅ Accepting challenge from room:', roomId);
    
    // Mark challenge as accepted
    firebase.database().ref(`challenges/${currentUser.uid}/${roomId}`).update({
        accepted: true,
        acceptedAt: Date.now(),
        acceptedBy: currentUser.uid
    });
    
    // Create the game
    const gameData = {
        players: {
            [currentUser.uid]: {
                name: currentUser.email,
                rating: playerRating,
                color: 'white'
            },
            [opponentId]: {
                name: '...',
                rating: 0,
                color: 'black'
            }
        },
        status: 'waiting',
        createdAt: Date.now(),
        lastMove: null
    };
    
    firebase.database().ref(`games/${roomId}`).set(gameData);
    
    // Switch to game tab and join game
    currentGameId = roomId;
    joinGame(roomId);
    
    // Switch to game tab
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('gameTab').classList.add('active');
    document.querySelector('[data-tab="game"]').classList.add('active');
    
    alert('Challenge accepted! Starting game...');
}

function declineChallenge(roomId) {
    console.log('❌ Declining challenge from room:', roomId);
    
    // Remove the challenge
    firebase.database().ref(`challenges/${currentUser.uid}/${roomId}`).remove();
    
    console.log('Challenge declined');
}

// ==================== ELO RATING SYSTEM ====================

function calculateEloChange(winnerRating, loserRating, gameResult) {
    const K = 32; // Standard K factor
    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
    
    const winnerChange = Math.round(K * (1 - expectedWinner));
    const loserChange = Math.round(K * (0 - expectedLoser));
    
    return { winnerChange, loserChange };
}

function updatePlayerRating(userId, ratingChange) {
    firebase.database().ref(`players/${userId}`).update({
        rating: firebase.database.ServerValue.increment(ratingChange),
        lastGameTime: Date.now()
    });
}

function saveGameToHistory(gameData) {
    if (!currentUser) return;
    
    const gameRecord = {
        playersIds: gameData.players,
        winner: gameData.winner,
        status: gameData.status,
        startTime: gameData.createdAt,
        endTime: Date.now(),
        moves: gameData.moveCount || 0,
        timestamp: Date.now()
    };
    
    firebase.database().ref(`games_history/${currentUser.uid}/${Date.now()}`).set(gameRecord);
    console.log('📝 Game saved to history');
}

// ==================== LEADERBOARD ====================

function loadLeaderboard() {
    firebase.database().ref('players').orderByChild('rating').limitToLast(10).on('value', snapshot => {
        const players = [];
        snapshot.forEach(playerSnapshot => {
            players.unshift(playerSnapshot.val());
        });
        displayLeaderboard(players);
    });
}

function displayLeaderboard(players) {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    if (players.length === 0) {
        leaderboardList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No players yet</p>';
        return;
    }
    
    leaderboardList.innerHTML = players.map((player, index) => `
        <div class="leaderboard-row">
            <div class="rank">#${index + 1}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-rating">⭐ ${player.rating}</div>
            <div class="status-dot ${player.status === 'available' ? 'online' : 'ingame'}"></div>
        </div>
    `).join('');
}

// ==================== GAME HISTORY ====================

function loadGameHistory() {
    if (!currentUser) return;
    
    firebase.database().ref(`games_history/${currentUser.uid}`).limitToLast(20).on('value', snapshot => {
        const games = [];
        snapshot.forEach(gameSnapshot => {
            games.unshift(gameSnapshot.val());
        });
        displayGameHistory(games);
    });
}

function displayGameHistory(games) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (games.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No games played yet</p>';
        return;
    }
    
    historyList.innerHTML = games.map(game => {
        const date = new Date(game.timestamp).toLocaleDateString();
        const isWin = game.winner === currentUser.email ? '✅ Win' : '❌ Loss';
        return `
            <div class="history-row">
                <div class="history-date">${date}</div>
                <div class="history-result">${isWin}</div>
                <div class="history-moves">${game.moves} moves</div>
            </div>
        `;
    }).join('');
}

// ==================== SOUND EFFECTS ====================

const SOUNDS = {
    move: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YRIAAAAAAA==',
    check: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==',
    checkmate: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YRIAAAAAAA=='
};

function playSound(soundType) {
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    if (!soundEnabled) return;
    
    try {
        const audio = new Audio(SOUNDS[soundType]);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (e) {
        console.log('Cannot play sound');
    }
}

function toggleSound() {
    const current = localStorage.getItem('soundEnabled') !== 'false';
    localStorage.setItem('soundEnabled', (!current).toString());
    console.log('Sound:', !current ? 'ON' : 'OFF');
}

// ==================== IN-GAME CHAT ====================

let chatMessages = [];

function sendChatMessage(message) {
    if (!currentGameId || !message.trim()) return;
    
    const chatData = {
        from: currentUser.email,
        fromId: currentUser.uid,
        message: message,
        timestamp: Date.now()
    };
    
    firebase.database().ref(`games/${currentGameId}/chat/${Date.now()}`).set(chatData);
    document.getElementById('chatInput').value = '';
}

function listenToChat() {
    if (!currentGameId) return;
    
    firebase.database().ref(`games/${currentGameId}/chat`).on('child_added', snapshot => {
        const msg = snapshot.val();
        displayChatMessage(msg);
    });
}

function displayChatMessage(msg) {
    const chatList = document.getElementById('chatMessages');
    if (!chatList) return;
    
    const isOwnMessage = msg.fromId === currentUser.uid;
    const msgEl = document.createElement('div');
    msgEl.className = `chat-message ${isOwnMessage ? 'own' : 'opponent'}`;
    msgEl.innerHTML = `
        <span class="chat-player">${msg.from}:</span>
        <span class="chat-text">${msg.message}</span>
    `;
    chatList.appendChild(msgEl);
    chatList.scrollTop = chatList.scrollHeight;
}

// ==================== SETTINGS ====================

const DEFAULT_SETTINGS = {
    lightSquareColor: '#f0d9b5',
    darkSquareColor: '#b58863',
    bgPrimaryColor: '#0d1b2a',
    bgSecondaryColor: '#1a2332',
    textPrimaryColor: '#e0e0e0',
    accentColor: '#ff6b6b'
};

function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
    loadSettings();
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// Close settings modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (modal && e.target === modal) {
        closeSettings();
    }
});

function saveSettings() {
    const settings = {
        lightSquareColor: document.getElementById('lightSquareColor').value,
        darkSquareColor: document.getElementById('darkSquareColor').value,
        bgPrimaryColor: document.getElementById('bgPrimaryColor').value,
        bgSecondaryColor: document.getElementById('bgSecondaryColor').value,
        textPrimaryColor: document.getElementById('textPrimaryColor').value,
        accentColor: document.getElementById('accentColor').value
    };
    
    localStorage.setItem('chessSettings', JSON.stringify(settings));
    applySettings(settings);
    alert('✅ Settings saved!');
    closeSettings();
}

function loadSettings() {
    const saved = localStorage.getItem('chessSettings');
    const settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    
    document.getElementById('lightSquareColor').value = settings.lightSquareColor;
    document.getElementById('darkSquareColor').value = settings.darkSquareColor;
    document.getElementById('bgPrimaryColor').value = settings.bgPrimaryColor;
    document.getElementById('bgSecondaryColor').value = settings.bgSecondaryColor;
    document.getElementById('textPrimaryColor').value = settings.textPrimaryColor;
    document.getElementById('accentColor').value = settings.accentColor;
}

function resetSettings() {
    if (confirm('Reset to default colors?')) {
        localStorage.removeItem('chessSettings');
        applySettings(DEFAULT_SETTINGS);
        loadSettings();
        alert('✅ Settings reset to default!');
    }
}

function applySettings(settings) {
    const root = document.documentElement.style;
    
    // Update CSS variables
    root.setProperty('--board-light', settings.lightSquareColor);
    root.setProperty('--board-dark', settings.darkSquareColor);
    root.setProperty('--bg-primary', settings.bgPrimaryColor);
    root.setProperty('--bg-secondary', settings.bgSecondaryColor);
    root.setProperty('--text-primary', settings.textPrimaryColor);
    root.setProperty('--secondary-color', settings.accentColor);
    
    console.log('🎨 Settings applied!');
}

function initializeSettings() {
    const saved = localStorage.getItem('chessSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        applySettings(settings);
    }
}

// ==================== INITIALIZATION ====================

function waitForFirebase() {
    console.log('⏳ Checking Firebase availability...');
    console.log('   firebase:', typeof firebase !== 'undefined');
    console.log('   firebase.auth:', typeof firebase !== 'undefined' ? typeof firebase.auth : 'N/A');
    
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.log('⏳ Firebase not ready yet, retrying in 500ms...');
        setTimeout(waitForFirebase, 500);
        return;
    }
    console.log('✓ Firebase ready, starting auth listener');
    setupAuthListener();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOMContentLoaded fired - starting initialization');
    initializeSettings();
    waitForFirebase();
});
