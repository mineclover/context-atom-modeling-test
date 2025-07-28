'use client'

import React, { useState } from 'react'

import Widget from './Widget'

export default function TestPage() {
	const [widgets, setWidgets] = useState<number[]>([1, 2, 3, 4, 5, 6, 7])

	const addWidget = () => {
		const newId = Math.max(...widgets, 0) + 1
		setWidgets([...widgets, newId])
	}

	const removeWidget = () => {
		if (widgets.length > 1) {
			setWidgets(widgets.slice(0, -1))
		}
	}

	const clearAll = () => {
		setWidgets([])
	}

	const resetWidgets = () => {
		setWidgets([1, 2, 3, 4, 5, 6, 7])
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				padding: '20px',
				background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			}}
		>
			{/* 컨트롤러 */}
			<div
				style={{
					position: 'sticky',
					top: '20px',
					zIndex: 100,
					marginBottom: '20px',
					padding: '16px',
					background: 'rgba(255, 255, 255, 0.95)',
					borderRadius: '16px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255,255,255,0.2)',
					display: 'flex',
					gap: '12px',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<h3
					style={{
						margin: '0',
						color: '#4a5568',
						fontSize: '16px',
						fontWeight: '600',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
					}}
				>
					🎛️ Widget Controller
				</h3>

				<div
					style={{
						display: 'flex',
						gap: '8px',
						flexWrap: 'wrap',
					}}
				>
					<button
						type="button"
						onClick={addWidget}
						style={{
							padding: '8px 16px',
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							fontSize: '14px',
							fontWeight: '600',
							cursor: 'pointer',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)'
							e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
						}}
					>
						➕ Add Widget
					</button>

					<button
						type="button"
						onClick={removeWidget}
						disabled={widgets.length <= 1}
						style={{
							padding: '8px 16px',
							background: widgets.length <= 1 ? '#e2e8f0' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
							color: widgets.length <= 1 ? '#a0aec0' : 'white',
							border: 'none',
							borderRadius: '8px',
							fontSize: '14px',
							fontWeight: '600',
							cursor: widgets.length <= 1 ? 'not-allowed' : 'pointer',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							transition: 'all 0.2s ease',
							opacity: widgets.length <= 1 ? 0.6 : 1,
						}}
						onMouseEnter={(e) => {
							if (widgets.length > 1) {
								e.currentTarget.style.transform = 'translateY(-2px)'
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
							}
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
						}}
					>
						➖ Remove Widget
					</button>

					<button
						type="button"
						onClick={clearAll}
						style={{
							padding: '8px 16px',
							background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							fontSize: '14px',
							fontWeight: '600',
							cursor: 'pointer',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)'
							e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
						}}
					>
						🗑️ Clear All
					</button>

					<button
						type="button"
						onClick={resetWidgets}
						style={{
							padding: '8px 16px',
							background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							fontSize: '14px',
							fontWeight: '600',
							cursor: 'pointer',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)'
							e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
						}}
					>
						🔄 Reset
					</button>
				</div>

				<div
					style={{
						padding: '6px 12px',
						background: 'rgba(102, 126, 234, 0.1)',
						borderRadius: '20px',
						fontSize: '12px',
						fontWeight: '600',
						color: '#667eea',
						border: '1px solid rgba(102, 126, 234, 0.2)',
					}}
				>
					📊 {widgets.length} Widgets
				</div>
			</div>

			{/* 위젯 그리드 */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
					gap: '20px',
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				{widgets.map((id) => (
					<Widget key={id} />
				))}
			</div>
		</div>
	)
}
