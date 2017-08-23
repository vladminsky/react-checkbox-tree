import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import nodeShape from './nodeShape';

class TreeNode extends React.Component {
    static propTypes = {
        allowFolderSelector: PropTypes.bool.isRequired,
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        singleValueOnly: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        children: PropTypes.node,
        className: PropTypes.string,
        icon: PropTypes.node,
        rawChildren: PropTypes.arrayOf(nodeShape),
    };

    static defaultProps = {
        allowFolderSelector: true,
        children: null,
        className: null,
        icon: null,
        rawChildren: null,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck() {
        let isChecked = false;

        // Toggle off state to checked
        if (this.props.checked === 0) {
            isChecked = true;
        }

        // Toggle partial state based on cascade model
        if (this.props.checked === 2) {
            isChecked = this.props.optimisticToggle;
        }

        this.props.onCheck({
            value: this.props.value,
            checked: isChecked,
            children: this.props.rawChildren,
        });
    }

    onExpand() {
        this.props.onExpand({
            value: this.props.value,
            expanded: !this.props.expanded,
        });
    }

    hasChildren() {
        return this.props.rawChildren !== null;
    }

    renderCollapseButton() {
        const { expandDisabled } = this.props;

        if (!this.hasChildren()) {
            return (
                <span className="rct-collapse">
                    <span className="rct-icon" />
                </span>
            );
        }

        return (
            <button
                aria-label="Toggle"
                className="rct-collapse rct-collapse-btn"
                disabled={expandDisabled}
                title="Toggle"
                type="button"
                onClick={this.onExpand}
            >
                {this.renderCollapseIcon()}
            </button>
        );
    }

    renderCollapseIcon() {
        if (!this.props.expanded) {
            return <span className="rct-icon rct-icon-expand-close" />;
        }

        return <span className="rct-icon rct-icon-expand-open" />;
    }

    renderCheckboxIcon(singleValueOnly) {
        const suffix = singleValueOnly ? 'radio' : 'check';
        const genClass = (head, tail) => (head + tail);
        if (this.props.checked === 0) {
            return <span className={genClass('rct-icon rct-icon-un', suffix)} />;
        }

        if (this.props.checked === 1) {
            return <span className={genClass('rct-icon rct-icon-', suffix)} />;
        }

        return <span className={genClass('rct-icon rct-icon-half-', suffix)} />;
    }

    renderNodeIcon() {
        if (this.props.icon !== null) {
            return this.props.icon;
        }

        if (!this.hasChildren()) {
            return <span className="rct-icon rct-icon-leaf" />;
        }

        if (!this.props.expanded) {
            return <span className="rct-icon rct-icon-parent-close" />;
        }

        return <span className="rct-icon rct-icon-parent-open" />;
    }

    renderChildren() {
        if (!this.props.expanded) {
            return null;
        }

        return this.props.children;
    }

    render() {
        const {
            checked,
            className,
            disabled,
            treeId,
            label,
            showNodeIcon,
            value,
            singleValueOnly,
            allowFolderSelector } = this.props;
        const inputId = `${treeId}-${value}`;
        const isFolder = this.hasChildren();
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-parent': isFolder,
            'rct-node-leaf': !isFolder,
        }, className);

        return (
            <li className={nodeClass}>
                <span className="rct-text">
                    {this.renderCollapseButton()}
                    <label htmlFor={inputId}>
                        <input
                            checked={checked === 1}
                            disabled={disabled}
                            id={inputId}
                            type="checkbox"
                            onChange={this.onCheck}
                        />
                        {(!isFolder || (isFolder && allowFolderSelector))
                            ? (<span className="rct-checkbox">{this.renderCheckboxIcon(singleValueOnly)}</span>)
                            : null
                        }
                        {showNodeIcon
                            ? (<span className="rct-node-icon">{this.renderNodeIcon()}</span>)
                            : null
                        }
                        <span className="rct-title">
                            {label}
                        </span>
                    </label>
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;
