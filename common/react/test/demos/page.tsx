'use client'

import React, { useState } from 'react'
import { CounterProvider } from '../contexts/counterContext'
import { UserProvider } from '../contexts/userContext'
import { ThemeProvider } from '../contexts/themeContext'
import { TextProvider } from '../contexts/textContext'
import Widget from '../components/Widget'
import { UserDisplay } from '../components/UserDisplay'
import { UserController } from '../components/UserController'
import { ThemeDisplay } from '../components/ThemeDisplay'
import { ThemeController } from '../components/ThemeController'
import { TextDisplay } from '../components/TextDisplay'
import { TextController } from '../components/TextController'

export default function TestPage() {
	const [widgets, setWidgets] = useState<number[]>([1, 2, 3, 4])

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
		setWidgets([1, 2, 3, 4])
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				padding: '20px',
				background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			}}
		>
			{/* Header */}
			<div
				style={{
					textAlign: 'center',
					marginBottom: '20px',
					padding: '16px',
					background: 'rgba(255, 255, 255, 0.95)',
					borderRadius: '16px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255,255,255,0.2)',
				}}
			>
				<h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px' }}>
					🚀 Jotai Context Demo
				</h1>
				<p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
					Simplified <code>createAtomContext</code> pattern with type safety
				</p>
			</div>

			{/* Counter Widgets Section */}
			<div
				style={{
					marginBottom: '20px',
					padding: '16px',
					background: 'rgba(255, 255, 255, 0.95)',
					borderRadius: '16px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255,255,255,0.2)',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '12px',
						flexWrap: 'wrap',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: '16px',
					}}
				>
					<h3 style={{ margin: '0', color: '#4a5568', fontSize: '16px', fontWeight: '600' }}>
						📊 Counter Widgets
					</h3>

					<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
						<button
							type="button"
							onClick={addWidget}
							style={{
								padding: '6px 12px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								border: 'none',
								borderRadius: '6px',
								fontSize: '12px',
								fontWeight: '600',
								cursor: 'pointer',
								boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
								transition: 'all 0.2s ease',
							}}
						>
							➕ Add
						</button>

						<button
							type="button"
							onClick={removeWidget}
							disabled={widgets.length <= 1}
							style={{
								padding: '6px 12px',
								background: widgets.length <= 1 ? '#e2e8f0' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								color: widgets.length <= 1 ? '#a0aec0' : 'white',
								border: 'none',
								borderRadius: '6px',
								fontSize: '12px',
								fontWeight: '600',
								cursor: widgets.length <= 1 ? 'not-allowed' : 'pointer',
								boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
								opacity: widgets.length <= 1 ? 0.6 : 1,
							}}
						>
							➖ Remove
						</button>

						<button
							type="button"
							onClick={resetWidgets}
							style={{
								padding: '6px 12px',
								background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
								color: 'white',
								border: 'none',
								borderRadius: '6px',
								fontSize: '12px',
								fontWeight: '600',
								cursor: 'pointer',
								boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							}}
						>
							🔄 Reset
						</button>
					</div>

					<div
						style={{
							padding: '4px 8px',
							background: 'rgba(102, 126, 234, 0.1)',
							borderRadius: '12px',
							fontSize: '10px',
							fontWeight: '600',
							color: '#667eea',
							border: '1px solid rgba(102, 126, 234, 0.2)',
						}}
					>
						{widgets.length} Widgets
					</div>
				</div>

				{/* Counter Widgets Grid */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '12px',
						alignItems: 'start',
						justifyContent: 'center',
					}}
				>
					{widgets.map((id) => (
						<CounterProvider key={id}>
							<Widget />
						</CounterProvider>
					))}
				</div>
			</div>

			{/* Context Examples Grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '20px',
				}}
			>
				{/* User Context */}
				<div
					style={{
						padding: '16px',
						background: 'rgba(255, 255, 255, 0.95)',
						borderRadius: '16px',
						boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255,255,255,0.2)',
					}}
				>
					<h3 style={{ margin: '0 0 12px 0', color: '#4a5568', fontSize: '16px', textAlign: 'center' }}>
						👤 User Context
					</h3>
					<UserProvider>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
							<UserDisplay />
							<UserController />
						</div>
					</UserProvider>
				</div>

				{/* Theme Context */}
				<div
					style={{
						padding: '16px',
						background: 'rgba(255, 255, 255, 0.95)',
						borderRadius: '16px',
						boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255,255,255,0.2)',
					}}
				>
					<h3 style={{ margin: '0 0 12px 0', color: '#4a5568', fontSize: '16px', textAlign: 'center' }}>
						🎨 Theme Context
					</h3>
					<ThemeProvider>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
							<ThemeDisplay />
							<ThemeController />
						</div>
					</ThemeProvider>
				</div>

				{/* Text Context */}
				<div
					style={{
						padding: '16px',
						background: 'rgba(255, 255, 255, 0.95)',
						borderRadius: '16px',
						boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255,255,255,0.2)',
					}}
				>
					<h3 style={{ margin: '0 0 12px 0', color: '#4a5568', fontSize: '16px', textAlign: 'center' }}>
						📝 Text Context
					</h3>
					<TextProvider>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
							<TextDisplay />
							<TextController />
						</div>
					</TextProvider>
				</div>
			</div>

			{/* Pattern Benefits Footer */}
			<div
				style={{
					marginTop: '20px',
					padding: '16px',
					background: 'rgba(233, 247, 239, 0.95)',
					borderRadius: '16px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(40, 167, 69, 0.2)',
				}}
			>
				<h3 style={{ margin: '0 0 12px 0', color: '#155724', fontSize: '16px', textAlign: 'center' }}>
					✨ Pattern Benefits
				</h3>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
					<div style={{ fontSize: '12px', color: '#155724' }}>• Single line context declaration</div>
					<div style={{ fontSize: '12px', color: '#155724' }}>• Type-safe by default</div>
					<div style={{ fontSize: '12px', color: '#155724' }}>• Automatic hook generation</div>
					<div style={{ fontSize: '12px', color: '#155724' }}>• Reusable across any atom type</div>
					<div style={{ fontSize: '12px', color: '#155724' }}>• Maintains atom isolation within contexts</div>
				</div>
			</div>
		</div>
	)
}
